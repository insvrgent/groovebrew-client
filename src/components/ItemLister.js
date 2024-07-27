import React, { useState, useRef } from "react";
import styles from "./ItemLister.module.css";
import Item from "./Item";
import {
  getItemQtyFromCart,
  updateItemQtyInCart,
  removeItemFromCart,
} from "../helpers/cartHelpers.js";
import {
  getImageUrl,
  createItem,
  updateItemType,
  deleteItemType,
} from "../helpers/itemHelper.js";

const ItemLister = ({
  itemTypeId,
  refreshTotal,
  shopId,
  user,
  typeName,
  itemList,
  forCart,
  forInvoice,
}) => {
  const [items, setItems] = useState(
    itemList.map((item) => ({
      ...item,
      qty: getItemQtyFromCart(shopId, item.itemId),
    })),
  );
  const [isEdit, setIsEditing] = useState(false);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [editedTypeName, setEditedTypeName] = useState(typeName);
  const typeNameInputRef = useRef(null);

  const handlePlusClick = (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.itemId === itemId) {
        const newQty = item.qty + 1;
        updateItemQtyInCart(shopId, itemId, newQty);

        if (forCart) refreshTotal();

        return { ...item, qty: newQty };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleNegativeClick = (itemId) => {
    const updatedItems = items
      .map((item) => {
        if (item.itemId === itemId && item.qty > 0) {
          const newQty = item.qty - 1;
          updateItemQtyInCart(shopId, itemId, newQty);

          if (forCart) {
            refreshTotal();
            return newQty > 0 ? { ...item, qty: newQty } : null;
          } else return { ...item, qty: newQty };
        }
        return item;
      })
      .filter((item) => item !== null);

    setItems(updatedItems);
  };

  const handleRemoveClick = (itemId) => {
    removeItemFromCart(shopId, itemId);
    const updatedItems = items.filter((item) => item.itemId !== itemId);
    setItems(updatedItems);

    if (!forCart) return;
    refreshTotal();
  };

  const toggleEditTypeItem = () => {
    setIsEditing((prev) => !prev);
    if (!isEdit) {
      setTimeout(() => {
        typeNameInputRef.current.focus();
      }, 0);
    }
  };

  const handleSaveType = async () => {
    try {
      await updateItemType(shopId, itemTypeId, typeNameInputRef.current.value);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save item type:", error);
    }
  };

  const handleRemoveType = async () => {
    try {
      await deleteItemType(shopId, itemTypeId);
      setIsEditing(false);
      // Optionally, you might want to refresh or update the parent component state here
    } catch (error) {
      console.error("Failed to delete item type:", error);
    }
  };

  const toggleAddNewItem = () => {
    setIsAddingNewItem((prev) => !prev);
  };

  return (
    <>
      {(items.length > 0 || (user && user.roleId == 1)) && (
        <div className={styles["item-lister"]}>
          <div className={styles["title-container"]}>
            <input
              ref={typeNameInputRef}
              className={`${styles.title} ${user && user.roleId == 1 && isEdit ? styles.border : styles.noborder}`}
              value={editedTypeName}
              onChange={(e) => setEditedTypeName(e.target.value)}
              disabled={!isEdit}
            />
            {user && user.roleId == 1 && (
              <>
                <button
                  className={styles["edit-typeItem-button"]}
                  onClick={toggleEditTypeItem}
                >
                  {isEdit ? "Cancel" : "Edit"}
                </button>
                {isEdit && (
                  <button
                    className={styles["edit-typeItem-button"]}
                    onClick={handleSaveType}
                  >
                    &nbsp;&nbsp;Save&nbsp;&nbsp;
                  </button>
                )}
              </>
            )}
          </div>
          <div className={styles["item-list"]}>
            {user && user.roleId == 1 && isEdit && (
              <>
                <button
                  className={styles["add-item-button"]}
                  onClick={toggleAddNewItem}
                >
                  {isAddingNewItem ? "Cancel" : "Add new Item"}
                </button>
                {isAddingNewItem && (
                  <Item
                    blank={true}
                    handleCreateItem={(name, price, qty, selectedImage) =>
                      createItem(
                        shopId,
                        name,
                        price,
                        qty,
                        selectedImage,
                        itemTypeId,
                      )
                    }
                  />
                )}
              </>
            )}
            {items.map((item) => {
              return !forCart || (forCart && item.qty > 0) ? (
                <Item
                  key={item.itemId}
                  forCart={forCart}
                  forInvoice={forInvoice}
                  name={item.name}
                  price={item.price}
                  qty={item.qty}
                  imageUrl={getImageUrl(item.image)}
                  onPlusClick={() => handlePlusClick(item.itemId)}
                  onNegativeClick={() => handleNegativeClick(item.itemId)}
                  onRemoveClick={() => handleRemoveClick(item.itemId)}
                />
              ) : null;
            })}

            {user && user.roleId == 1 && isEdit && (
              <>
                <button
                  className={styles["add-item-button"]}
                  onClick={handleRemoveType}
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ItemLister;
