import React, { useEffect, useState, useRef } from "react";
import styles from "./ItemLister.module.css";
import Item from "./Item";
import Switch from "react-switch";
import {
  getItemQtyFromCart,
  updateItemQtyInCart,
  removeItemFromCart,
} from "../helpers/cartHelpers.js";
import {
  getImageUrl,
  updateItemAvalilability,
  updateItemType,
  deleteItemType,
} from "../helpers/itemHelper.js";

const ItemLister = ({
  itemTypeId,
  refreshTotal,
  shopId,
  shopOwnerId,
  user,
  typeName,
  itemList,
  forCart,
  forInvoice,
  isEditMode,
  raw,
  handleCreateItem,
  handleUpdateItem,
  beingEditedType,
  setBeingEditedType,
}) => {
  const [items, setItems] = useState(
    itemList.map((item) => ({
      ...item,
      qty: getItemQtyFromCart(shopId, item.itemId),
    }))
  );

  useEffect(() => {
    setItems(
      itemList.map((item) => ({
        ...item,
        qty: getItemQtyFromCart(shopId, item.itemId),
      }))
    );
  }, [itemList]);

  const [isEdit, setIsEditing] = useState(false);
  const [onEditItem, setOnEditItem] = useState(0);
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

  useEffect(() => {
    if(beingEditedType == itemTypeId)return;
    
    setOnEditItem(0); 
    setIsAddingNewItem(false);
    console.log(itemTypeId)
  }, [beingEditedType]);

  const toggleAddNewItem = () => {
    setIsAddingNewItem((prev) => !prev);
    setOnEditItem(0);
    setBeingEditedType(itemTypeId);
  };
  const editItem = (itemId) => {
    setIsAddingNewItem(false);
    setOnEditItem(itemId);
    setBeingEditedType(itemTypeId);
  };
  const handleChange = async (itemId) => {
    // Find the item in the current items array
    console.log(itemId);
    const itemIndex = items.findIndex((item) => item.itemId === itemId);
    if (itemIndex === -1) return; // Item not found

    // Create a copy of the current items array
    const updatedItems = [...items];
    const item = updatedItems[itemIndex];

    // Toggle the availability locally
    const newAvailability = !item.availability;
    updatedItems[itemIndex] = {
      ...item,
      availability: newAvailability,
    };

    // Update the state with the local change
    setItems(updatedItems);

    try {
      // Wait for the updateItemAvailability response
      const response = await updateItemAvalilability(itemId, newAvailability);

      // Assuming response contains the updated item data
      const updatedItem = response;
      console.log(updatedItem);
      // Update only the specified item in the state
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.itemId === itemId ? updatedItem : prevItem
        )
      );
    } catch (error) {
      // Handle error (e.g., revert the change or show an error message)
      console.error("Error updating item availability:", error);

      // Optionally revert to the previous availability if needed
      updatedItems[itemIndex].availability = item.availability; // revert back
      setItems(updatedItems);
    }
  };
  const onCreateItem = (itemName, itemPrice, selectedImage, previewUrl) => {
    handleCreateItem(itemName, itemPrice, selectedImage, previewUrl);
    setIsAddingNewItem(false);
  };

  return (
    <>
      {(items.length > 0 ||
        (user && (user.cafeId == shopId || user.userId == shopOwnerId))) && (
        <div className={styles["item-lister"]}>
          {!raw && (
            <div className={styles["title-container"]}>
              <input
                ref={typeNameInputRef}
                className={`${styles.title} ${
                  isEdit
                    ? styles.border
                    : styles.noborder
                }`}
                value={editedTypeName}
                onChange={(e) => setEditedTypeName(e.target.value)}
                disabled={!isEdit}
              />
              {isEditMode && (
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
          )}
          <div className={styles["item-list"]}>
            {user &&
              user.roleId == 1 &&
              user.userId == shopOwnerId &&
              isEditMode && (
                <>
                  {!isAddingNewItem && (
                    <button
                      className={styles["add-item-button"]}
                      onClick={toggleAddNewItem}
                      style={{
                        display: "inline-block",
                        height: "159px",
                        fontSize: "50px",
                      }}
                    >
                      +
                    </button>
                  )}
                  {isAddingNewItem && (
                    <>
                      <button
                        className={styles["add-item-button"]}
                        onClick={toggleAddNewItem}
                        style={{ display: "inline-block" }}
                      >
                        ↩
                      </button>
                      <Item blank={true} handleCreateItem={onCreateItem} />
                    </>
                  )}
                </>
              )}
            {items.map((item) => {
              return !forCart || (forCart && item.qty > 0) ? (
                <>
                  {onEditItem == item.itemId && (
                    <button
                      className={styles["add-item-button"]}
                      onClick={() => editItem(0)}
                      style={{ display: "inline-block" }}
                    >
                      ↩
                    </button>
                  )}
                  <div className={styles["itemWrapper"]}>
                    {isEditMode && onEditItem != item.itemId&&
                        (
                      <div className={styles["editModeLayout"]}>
                        {isEditMode && (
                          <Switch
                            onChange={() => handleChange(item.itemId)}
                            checked={item.availability}
                          />
                        )}
                        <h3>
                          {item.availability ? "available" : "unavailable"}
                        </h3>
                        <button onClick={() => editItem(item.itemId)}>
                          edit
                        </button>
                      </div>
                    )}

                    <Item
                      key={item.itemId}
                      forCart={forCart}
                      forInvoice={forInvoice}
                      name={item.name}
                      price={item.price}
                      qty={item.qty}
                      imageUrl={
                        itemTypeId ? getImageUrl(item.image) : item.image
                      }
                      onPlusClick={() => handlePlusClick(item.itemId)}
                      onNegativeClick={() => handleNegativeClick(item.itemId)}
                      onRemoveClick={() => handleRemoveClick(item.itemId)}
                      isBeingEdit={
                        onEditItem == item.itemId 
                      }
                      isAvailable={item.availability}
                      handleUpdateItem={(name, price, image) =>
                        handleUpdateItem(item.itemId, name, price, image)
                      }
                    />
                  </div>
                </>
              ) : null;
            })}

            {user &&
              user.roleId == 1 &&
              user.userId == shopOwnerId &&
              isEdit && (
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
