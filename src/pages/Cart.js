import React, { useRef, useEffect, useState } from 'react';
import styles from './Cart.module.css';
import ItemLister from '../components/ItemLister';
import { ThreeDots, ColorRing } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import { useNavigationHelpers } from '../helpers/navigationHelpers';
import { getTable } from '../helpers/tableHelper.js';
import { getCartDetails } from '../helpers/itemHelper.js';
import { getItemsByCafeId } from '../helpers/cartHelpers'; // Import getItemsByCafeId
import Modal from '../components/Modal'; // Import the reusable Modal component

export default function Cart({ sendParam, totalItemsCount }) {
  const { shopId } = useParams();
  sendParam(shopId);

  const { goToShop, goToInvoice } = useNavigationHelpers(shopId);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderType, setOrderType] = useState('pickup');
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false); // State for checkout button loading animation
  const [email, setEmail] = useState('');

  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const items = await getCartDetails(shopId);
        setLoading(false);

        if (items) setCartItems(items);

        const initialTotalPrice = items.reduce((total, itemType) => {
          return total + itemType.itemList.reduce((subtotal, item) => {
            return subtotal + (item.qty * item.price);
          }, 0);
        }, 0);
        setTotalPrice(initialTotalPrice);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();

    const textarea = textareaRef.current;
    if (textarea) {
      const handleResize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      textarea.addEventListener('input', handleResize);
      handleResize();
      return () => textarea.removeEventListener('input', handleResize);
    }
  }, [shopId]);

  const refreshTotal = async () => {
    try {
      const items = await getItemsByCafeId(shopId);
      const updatedTotalPrice = items.reduce((total, localItem) => {
        const cartItem = cartItems.find(itemType =>
          itemType.itemList.some(item => item.itemId === localItem.itemId)
        );

        if (cartItem) {
          const itemDetails = cartItem.itemList.find(item => item.itemId === localItem.itemId);
          return total + (localItem.qty * itemDetails.price);
        }
        return total;
      }, 0);

      setTotalPrice(updatedTotalPrice);
    } catch (error) {
      console.error('Error refreshing total price:', error);
    }
  };

  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  const handleTableNumberChange = (event) => {
    setTableNumber(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlCloseModal = () => {
    setIsModalOpen(false);
    setIsCheckoutLoading(false);
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleCheckout = async () => {
    setIsCheckoutLoading(true); // Start loading animation

    if (email != '' && !isValidEmail(email)) {
      setModalContent(<div>Please enter a valid email address.</div>);
      setIsModalOpen(true);
      setIsCheckoutLoading(false); // Stop loading animation
      return;
    }

    if (orderType === 'serve') {
      if (tableNumber !== '') {
        const table = await getTable(shopId, tableNumber);
        if (!table) {
          setModalContent(<div>Table not found. Please enter a valid table number.</div>);
          setIsModalOpen(true);
        } else {
          goToInvoice(orderType, tableNumber, email);
        }
      } else {
        setModalContent(<div>Please enter a table number.</div>);
        setIsModalOpen(true);
      }
    } else {
      goToInvoice(orderType, tableNumber, email);
    }

    setIsCheckoutLoading(false); // Stop loading animation
  };

  if (loading)
    return (
      <div className='Loader'>
        <div className='LoaderChild'>
          <ThreeDots />
        </div>
      </div>
    );
  else
    return (
      <div className={styles.Cart}>
        <div style={{ marginTop: '30px' }}></div>
        <h2 className={styles['Cart-title']}>{totalItemsCount} {totalItemsCount !== 1 ? 'items' : 'item'} in Cart</h2>
        <div style={{ marginTop: '-45px' }}></div>
        {cartItems.map(itemType => (
          <ItemLister
            key={itemType.itemTypeId}
            refreshTotal={refreshTotal}
            shopId={shopId}
            forCart={true}
            typeName={itemType.typeName}
            itemList={itemType.itemList}
          />
        ))}

        <div className={styles.EmailContainer}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className={styles.EmailInput}
          />
        </div>
        <div className={styles.OrderTypeContainer}>
          <span htmlFor="orderType">Order Type:</span>
          <select id="orderType" value={orderType} onChange={handleOrderTypeChange}>
            <option value="pickup">Pickup</option>
            <option value="serve">Serve</option>
          </select>
          {orderType === 'serve' && (
            <input
              type="text"
              placeholder="Table Number"
              value={tableNumber}
              onChange={handleTableNumberChange}
              className={styles.TableNumberInput}
            />
          )}
        </div>

        <div className={styles.NoteContainer}>
          <span>Note</span>
          <span></span>
        </div>

        <textarea
          ref={textareaRef}
          className={styles.NoteInput}
          placeholder="Add a note..."
        />

        <div className={styles.TotalContainer}>
          <span>Total:</span>
          <span>Rp {totalPrice}</span>
        </div>
        <button onClick={handleCheckout} className={styles.CheckoutButton}>
          {isCheckoutLoading ? <ColorRing height="50" width="50" color="white" /> : 'Checkout'}
        </button>
        <div onClick={goToShop} className={styles.BackToMenu}>Back to menu</div>

        <Modal isOpen={isModalOpen} onClose={() => handlCloseModal()}>
          {modalContent}
        </Modal>
      </div>
    );
}
