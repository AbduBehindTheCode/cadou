import { FormEvent, useEffect, useState } from 'react';
import type { Product } from './data/sampleData';
import { supabase } from './lib/supabase';

type ReservationState = {
  productId: string | null;
  reserverName: string;
  message: string;
};

const DELIVERY_META: Record<
  Product['delivery_type'],
  { label: string; explanation: string; tone: 'pink' | 'peach' | 'lavender' | 'neutral' }
> = {
  small_travel_item: {
    label: 'Pratique pour le voyage',
    explanation: 'Petit article. Nous pouvons le transporter depuis la Tunisie en avion.',
    tone: 'pink',
  },
  large_home_delivery: {
    label: 'Pour la maison',
    explanation: 'Grand article. Il peut être livré à la maison ou acheté en Europe.',
    tone: 'peach',
  },
  europe_only: {
    label: 'Disponibilité Europe',
    explanation: 'Cet article est plus simple à acheter en Europe ou à faire livrer à la maison.',
    tone: 'lavender',
  },
  general: {
    label: 'À voir',
    explanation: 'Cet article est simple à organiser et à ajuster selon nos besoins.',
    tone: 'neutral',
  },
};

async function loadProducts(): Promise<Product[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from('products').select('*').order('created_at', {
    ascending: true,
  });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Product[];
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reserveState, setReserveState] = useState<ReservationState>({
    productId: null,
    reserverName: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);
  const [reservationThanks, setReservationThanks] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setIsLoading(true);

    loadProducts().then((loadedProducts) => {
      if (!active) {
        return;
      }
      setProducts(loadedProducts);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleReserveClick = (product: Product) => {
    if (product.status === 'reserved') {
      return;
    }

    setReserveState({
      productId: product.id,
      reserverName: '',
      message: '',
    });
    setSuccessMessage(null);
  };

  const handleSubmitReservation = async (event: FormEvent) => {
    event.preventDefault();

    if (!reserveState.productId) {
      return;
    }

    const productToUpdate = products.find((product) => product.id === reserveState.productId);

    if (!productToUpdate || productToUpdate.status === 'reserved') {
      setSuccessMessage('Cet article a déjà été réservé.');
      return;
    }

    const reservedBy = reserveState.reserverName.trim() || 'Anonyme';
    const nextValue: Product = {
      ...productToUpdate,
      status: 'reserved',
      reserved_by: reservedBy,
      reserved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase
        .from('products')
        .update({
          status: 'reserved',
          reserved_by: reservedBy,
          reserved_at: nextValue.reserved_at,
          updated_at: nextValue.updated_at,
        })
        .eq('id', productToUpdate.id);

      if (error) {
        console.error(error);
        setSuccessMessage('Un problème est survenu. Veuillez réessayer.');
        return;
      }
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productToUpdate.id ? nextValue : product,
      ),
    );

    const confirmationText = `“${productToUpdate.name}” a bien été réservé avec amour.`;
    setSuccessMessage(confirmationText);
    setReservationThanks(productToUpdate.name);
    setReserveState({ productId: null, reserverName: '', message: '' });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="tag">Baby Girl eddenya</span>
          <h1>Notre liste bébé</h1>
        </div>
        <p className="subtitle">Une petite liste de choses que nous aimons pour ce nouveau chapitre.</p>
      </header>

      {successMessage ? (
        <div className="toast" role="status" aria-live="polite">
          {successMessage}
        </div>
      ) : null}

      {isLoading ? (
        <main className="loading-shell" aria-live="polite" aria-busy="true">
          <div className="baby-loader">
            <div className="swing-frame">
              <div className="swing-seat">
                <span className="baby-face">◡</span>
              </div>
              <div className="swing-rope rope-left" />
              <div className="swing-rope rope-right" />
            </div>
            <div className="loader-text-wrap">
              <p className="loader-label">Baby Girl Edenya</p>
              <h2>Chargement de notre liste...</h2>
              <div className="loading-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="product-list">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">♡</div>
              <h2>Notre liste se prépare</h2>
              <p>Nous ajoutons les premiers petits trésors pour Edenya.</p>
            </div>
          ) : null}

          {products.map((product) => {
            const meta = DELIVERY_META[product.delivery_type];
            const isReserved = product.status === 'reserved';
            const displayShortNote = product.short_note && product.short_note !== meta.label ? product.short_note : '';

            return (
              <article
                key={product.id}
                className={`product-card ${isReserved ? 'reserved' : 'available'}`}
              >
              <div className="image-wrap">
                <img src={product.image_url} alt={product.name} />
                <span className={`status-badge ${isReserved ? 'reserved' : 'available'}`}>
                  {isReserved ? 'Réservé' : 'Disponible'}
                </span>
              </div>

              <div className="card-body">
                <div className="card-header-row">
                  <h2>{product.name}</h2>
                  <button
                    type="button"
                    className="mini-info"
                    onClick={() =>
                      setDeliveryInfo((current) =>
                        current === product.id ? null : product.id,
                      )
                    }
                    aria-label={`Plus d’informations sur ${product.name}`}
                  >
                    i
                  </button>
                </div>

                {displayShortNote ? <p className="short-note">{displayShortNote}</p> : null}

                <div className={`delivery-tag ${meta.tone}`}>
                  {meta.label}
                </div>

                {deliveryInfo === product.id ? (
                  <div className="delivery-info-box">
                    <p>{product.delivery_note}</p>
                  </div>
                ) : null}

                <div className="card-actions">
                  <a href={product.product_url} target="_blank" rel="noreferrer" className="shop-link">
                    Voir l’article
                  </a>

                  <button
                    type="button"
                    className="details-button"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Détails
                  </button>

                  <button
                    type="button"
                    className="reserve-button"
                    onClick={() => handleReserveClick(product)}
                    disabled={isReserved}
                  >
                    {isReserved ? 'Déjà pris' : 'Réserver'}
                  </button>
                </div>
              </div>
            </article>
            );
          })}
        </main>
      )}

      {selectedProduct ? (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-button" onClick={() => setSelectedProduct(null)}>
              ×
            </button>
            <div className="modal-image-wrap">
              <img src={selectedProduct.image_url} alt={selectedProduct.name} />
            </div>
            <div className="modal-body">
              <span className={`status-badge ${selectedProduct.status === 'reserved' ? 'reserved' : 'available'}`}>
                {selectedProduct.status === 'reserved' ? 'Réservé' : 'Disponible'}
              </span>
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.description}</p>
              <div className={`delivery-tag ${DELIVERY_META[selectedProduct.delivery_type].tone}`}>
                {DELIVERY_META[selectedProduct.delivery_type].label}
              </div>
              <p className="delivery-explanation">
                {selectedProduct.delivery_note}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {reservationThanks ? (
        <div
          className="modal-overlay"
          onClick={() => setReservationThanks(null)}
        >
          <div className="modal-card success-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-button" onClick={() => setReservationThanks(null)}>
              ×
            </button>
            <div className="success-icon">✓</div>
            <h3>Merci !</h3>
            <p className="success-message">
              {reservationThanks} a bien été réservé pour vous.
            </p>
            <p className="success-note">
              Si vous avez une question, n’hésitez pas à nous contacter.
            </p>
            <button type="button" className="confirm-button" onClick={() => setReservationThanks(null)}>
              Fermer
            </button>
          </div>
        </div>
      ) : null}

      {reserveState.productId ? (
        <div className="modal-overlay" onClick={() => setReserveState({ productId: null, reserverName: '', message: '' })}>
          <div className="modal-card reserve-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="close-button"
              onClick={() => setReserveState({ productId: null, reserverName: '', message: '' })}
            >
              ×
            </button>

            <h3>Réserver ce cadeau</h3>
            <p className="reserve-intro">
              Dites-nous qui réserve cet article.
            </p>

            <form onSubmit={handleSubmitReservation}>
              <label>
                Nom
                <input
                  type="text"
                  value={reserveState.reserverName}
                  onChange={(event) =>
                    setReserveState((current) => ({
                      ...current,
                      reserverName: event.target.value,
                    }))
                  }
                  placeholder="Votre nom"
                  required
                />
              </label>

              <label>
                Message (optionnel)
                <textarea
                  value={reserveState.message}
                  onChange={(event) =>
                    setReserveState((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  placeholder="Un petit mot pour la famille"
                  rows={3}
                />
              </label>

              <button type="submit" className="confirm-button">
                Confirmer la réservation
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
