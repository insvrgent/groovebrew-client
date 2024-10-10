import React, { useEffect, useState, useRef } from "react";
import styles from "./ItemLister.module.css";
import Item from "./Item";
import Switch from "react-switch";
import { ThreeDots, ColorRing } from "react-loader-spinner";
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
import ItemType from "./ItemType.js";

const ItemLister = ({
  itemTypeId,
  refreshTotal,
  shopId,
  shopOwnerId,
  user,
  typeName,
  typeImage,
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
    if (beingEditedType == itemTypeId) return;

    setOnEditItem(0);
    setIsAddingNewItem(false);
  }, [beingEditedType]);

  const toggleAddNewItem = () => {
    setBeingEditedType(itemTypeId);
    setIsAddingNewItem((prev) => !prev);
    setOnEditItem(0);
  };
  const editItem = (itemId) => {
    setBeingEditedType(itemTypeId);
    setIsAddingNewItem(false);
    setOnEditItem(itemId);
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
  console.log(getImageUrl(typeImage));
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  useEffect(() => {
    if (selectedImage) {
      setPreviewUrl(selectedImage);
    } else {
      setPreviewUrl(getImageUrl(typeImage));
    }
  }, [selectedImage]);
  const handleImageChange = (e) => {
    setSelectedImage(e);
  };
  return (
    <>
      {(items.length > 0 ||
        (user && (user.cafeId == shopId || user.userId == shopOwnerId))) && (
        <div
          className={`${styles["item-lister"]} ${
            isEdit ? styles["fullscreen"] : ""
          }`}
          style={{ paddingBottom: isEdit ? "25vh" : "" }}
        >
          {!raw && (
            <div className={styles["title-container"]}>
              {isEdit && <ItemType blank={true} imageUrl={previewUrl} />}
              <input
                ref={typeNameInputRef}
                className={`${styles.title} ${
                  isEdit ? styles.border : styles.noborder
                }`}
                value={editedTypeName}
                onChange={(e) => setEditedTypeName(e.target.value)}
                disabled={!isEdit}
              />
              {isEditMode && !isEdit && (
                <>
                  <button
                    className={styles["edit-typeItem-button"]}
                    onClick={toggleEditTypeItem}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          )}
          {isEdit && (
            <div className={styles["grid-container"]}>
              <ItemType
                rectangular={true}
                blank={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/addnew.png")}
              />
              {typeImage != null && !previewUrl.includes(typeImage) && (
                <ItemType
                  rectangular={true}
                  onClick={(e) => handleImageChange(e)}
                  imageUrl={getImageUrl(typeImage)}
                />
              )}

              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/beverage1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/beverage2.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/beverage3.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/dessert1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/dessert2.jpg")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/food1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/food2.jpg")}
              />

              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/food3.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/packet1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/packet2.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/snack1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/snack2.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/snack3.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(e) => handleImageChange(e)}
                imageUrl={getImageUrl("uploads/snack4.png")}
              />
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
                    {isEditMode && onEditItem != item.itemId && (
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
                      isBeingEdit={onEditItem == item.itemId}
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
          {isEdit && (
            <div className={styles.PaymentOption}>
              <div className={styles.TotalContainer}>
                <span>Pengaturan</span>
                <span className="svg-container">
  <svg 
    enable-background="new 0 0 91 91" 
    height="91px" 
    id="Layer_1" 
    version="1.1" 
    viewBox="0 0 91 91" 
    width="40px" 
  >
    <g>
      <path d="M45.574,38.253c-5.443,0-9.871,4.428-9.871,9.871s4.428,9.871,9.871,9.871s9.871-4.428,9.871-9.871 S51.018,38.253,45.574,38.253z M45.574,54.595c-3.568,0-6.471-2.904-6.471-6.471c0-3.568,2.902-6.471,6.471-6.471 c3.566,0,6.471,2.902,6.471,6.471C52.045,51.69,49.141,54.595,45.574,54.595z"/>
      <path d="M64.057,27.726l-6.975,4.029c-0.971-0.686-2.004-1.281-3.086-1.781v-8.061H37.152v8.061 c-1.008,0.467-1.979,1.021-2.898,1.654l-6.936-4.111l-8.586,14.488l6.936,4.109c-0.078,0.709-0.115,1.373-0.115,2.01 c0,0.574,0.029,1.158,0.092,1.785l-6.98,4.031l8.422,14.584l6.979-4.031c0.973,0.686,2.004,1.281,3.088,1.781v8.061h16.844v-8.061 c1.008-0.467,1.977-1.021,2.896-1.654l6.936,4.111l8.586-14.488l-6.934-4.109c0.078-0.705,0.115-1.371,0.115-2.01 c0-0.576-0.029-1.158-0.092-1.785l6.98-4.031L64.057,27.726z M61.824,44.538l0.17,1.143c0.137,0.928,0.203,1.703,0.203,2.443 c0,0.797-0.076,1.656-0.232,2.631l-0.182,1.141l5.973,3.539l-5.119,8.639l-5.973-3.541l-0.914,0.713 c-1.244,0.969-2.617,1.754-4.078,2.33l-1.076,0.424v6.936H40.551v-6.934l-1.074-0.426c-1.533-0.605-2.955-1.428-4.23-2.443 l-0.906-0.723l-6.01,3.471l-5.021-8.695l6.016-3.475l-0.17-1.143c-0.137-0.928-0.203-1.703-0.203-2.443 c0-0.801,0.074-1.639,0.232-2.635l0.178-1.139l-5.971-3.537l5.119-8.639l5.973,3.543l0.914-0.713 c1.248-0.971,2.621-1.756,4.08-2.332l1.074-0.424v-6.936h10.045v6.934l1.076,0.426c1.529,0.605,2.953,1.428,4.229,2.443 l0.908,0.723l6.008-3.469l5.023,8.693L61.824,44.538z"/>
    </g>
  </svg>
</span>

              </div>
              <button className={styles.PayButton}>
                {false ? (
                  <ColorRing height="50" width="50" color="white" />
                ) : (
                  "Simpan"
                )}
              </button>
              <div
                className={styles.Pay2Button}
                onClick={() => setIsEditing(false)}
              >
                Kembali
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ItemLister;
