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
import { createItemType } from "../helpers/itemHelper.js";

const ItemLister = ({
  itemTypeId,
  typeVisibility=true,
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
  handleCreateItem,
  handleUpdateItem,
  handleUnEdit,
  beingEditedType,
  setBeingEditedType,
  alwaysEdit,
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

  const [isVisible, setIsVisible] = useState(typeVisibility);
  const [isEdit, setIsEditing] = useState(alwaysEdit);
  const [isEditItem, setisEditItem] = useState(0);
  const [isAddingNewItem, setIsAddingNewItem] = useState(alwaysEdit);
  const [editedTypeName, setEditedTypeName] = useState(typeName);
  const typeNameInputRef = useRef(null);
  const [itemsToCreate, setItemsToCreate] = useState([]);
  const [itemsToUpdate, setItemsToUpdate] = useState([]);

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

    setisEditItem(0);
    setIsAddingNewItem(false);
  }, [beingEditedType]);

  const toggleAddNewItem = () => {
    setBeingEditedType(itemTypeId);
    setIsAddingNewItem((prev) => !prev);
    setisEditItem(0);
  };
  const editItem = (itemId) => {
    setBeingEditedType(itemTypeId);
    setIsAddingNewItem(false);
    setisEditItem(itemId);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(getImageUrl(typeImage));
  // useEffect(() => {
  //   if (!selectedImage) {
  //     setPreviewUrl(getImageUrl(typeImage));
  //   } else {
  //     setPreviewUrl(selectedImage);
  //   }
  //   console.log(selectedImage);
  // }, [selectedImage]);

  const handleImageChange = (previewUrl, selectedImage) => {
    setSelectedImage(selectedImage);
    console.log(selectedImage);
    setPreviewUrl(previewUrl);
  };

  const onCreateItem = (itemName, itemPrice, selectedImage, previewUrl) => {
    if (isEdit)
      setItemsToCreate((prevItems) => [
        ...prevItems,
        {
          itemId: -(prevItems.length + 1),
          name: itemName,
          price: itemPrice,
          selectedImage,
          image: previewUrl,
        },
      ]);
    else handleCreateItem(itemTypeId, itemName, itemPrice, selectedImage);

    console.log(items);
    console.log(itemsToCreate);

    setIsAddingNewItem(false);
  };
  const updateItemInCreate = (
    itemId,
    name,
    price,
    selectedImage,
    previewUrl
  ) => {
    setItemsToCreate((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId
          ? { ...item, name, price, selectedImage, image: previewUrl }
          : item
      )
    );
  };
  const onUpdateItem = (itemId, name, price, image) => {
    if (isEdit)
      setItemsToUpdate((prev) => [...prev, { itemId, name, price, image }]);
    else handleUpdateItem(itemId, name, price, image);
    console.log(itemsToUpdate);
  };

  const handleChange = (itemId) => {
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

    if (isEdit) {
      // If isEdit, add item to the list of items to update
      setItemsToUpdate((prev) => [...prev, { itemId, newAvailability }]);
    } else {
      // If not isEdit, immediately execute the update
      executeUpdateAvailability(
        itemId,
        newAvailability,
        updatedItems,
        itemIndex
      );
    }
    console.log(itemsToUpdate);
  };

  const executeUpdateAvailability = async (
    itemId,
    newAvailability,
    updatedItems,
    itemIndex
  ) => {
    try {
      console.log(itemId + newAvailability);
      const response = await updateItemAvalilability(itemId, newAvailability);
      const updatedItem = response;
      console.log(updatedItem);

      // Update only the specified item in the state
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.itemId === itemId ? updatedItem : prevItem
        )
      );
    } catch (error) {
      console.error("Error updating item availability:", error);
      updatedItems[itemIndex].availability = !newAvailability; // revert back
      setItems(updatedItems);
    }
  };

  const handleSaveType = async () => {
    try {
      console.log(isVisible);
      if (itemTypeId) {
        await updateItemType(
          shopId,
          itemTypeId,
          typeNameInputRef.current.value,
          previewUrl,
          selectedImage,
          isVisible
        );

        // Iterate through itemsToUpdate and call the API
        for (const {
          itemId,
          newAvailability,
          name,
          price,
          image,
        } of itemsToUpdate) {
          if (newAvailability != undefined)
            await executeUpdateAvailability(
              itemId,
              newAvailability,
              items,
              items.findIndex((item) => item.itemId === itemId)
            );
          else await handleUpdateItem(itemId, name, price, image);
        }
        for (const { name, price, selectedImage } of itemsToCreate) {
          handleCreateItem(itemTypeId, name, price, selectedImage);
        }
      } else {
        const itemType = await createItemType(
          shopId,
          editedTypeName,
          selectedImage
        );
        console.log(itemType);
        for (const { name, price, selectedImage } of itemsToCreate) {
          handleCreateItem(itemType.itemTypeId, name, price, selectedImage);
        }
      }
      // Clear the itemsToUpdate after saving
      setItemsToUpdate([]);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save item type:", error);
    }
  };

  const resetItems = () => {
    // Create a copy of the current items to revert
    const updatedItems = [...items];

    // Iterate over itemsToUpdate and reset the availability
    itemsToUpdate.forEach(({ itemId, newAvailability }) => {
      const itemIndex = updatedItems.findIndex(
        (item) => item.itemId === itemId
      );
      if (itemIndex !== -1) {
        updatedItems[itemIndex].availability = !newAvailability; // revert back to original
      }
    });

    // Update the items state and clear itemsToUpdate
    setItems(updatedItems);
    setItemsToUpdate([]);
    setIsEditing(false);
    if (handleUnEdit) handleUnEdit();
  };

  return (
    <>
      {(items.length > 0 ||
        (user && (user.cafeId == shopId || user.userId == shopOwnerId))) && (
        <div
          className={`${styles["item-lister"]} ${
            isEdit ? styles["fullscreen"] : ""
          }`}
          style={{ paddingBottom: isEdit ? "28vh" : "" }}
        >
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
          {isEdit && (
            <div className={styles["grid-container"]}>
              <ItemType
                rectangular={true}
                blank={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/addnew.png")}
              />
              {/* {typeImage != null && !previewUrl.includes(typeImage) && (
                <ItemType
                  rectangular={true}
                  onClick={(previewUrl, selectedImage) =>
                    handleImageChange(previewUrl, selectedImage)
                  }
                  imageUrl={getImageUrl(typeImage)}
                />
              )} */}

              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/beverage4.jpg")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/beverage1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/beverage2.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/beverage3.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/snack5.jpg")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/dessert1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/dessert2.jpg")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/food4.jpg")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/food1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/food2.jpg")}
              />

              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/food3.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/packet1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/packet2.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/snack1.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/snack2.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
                imageUrl={getImageUrl("uploads/snack3.png")}
              />
              <ItemType
                rectangular={true}
                onClick={(previewUrl, selectedImage) =>
                  handleImageChange(previewUrl, selectedImage)
                }
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

            {itemsToCreate.map((item) => {
              return !forCart || (forCart && item.qty > 0) ? (
                <>
                  {isEditItem == item.itemId && (
                    <button
                      className={styles["add-item-button"]}
                      onClick={() => editItem(0)}
                      style={{ display: "inline-block" }}
                    >
                      ↩
                    </button>
                  )}
                  <div className={styles["itemWrapper"]}>
                    {isEditMode && isEditItem != item.itemId && (
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
                      imageUrl={item.image}
                      onPlusClick={() => handlePlusClick(item.itemId)}
                      onNegativeClick={() => handleNegativeClick(item.itemId)}
                      onRemoveClick={() => handleRemoveClick(item.itemId)}
                      isBeingEdit={isEditItem == item.itemId}
                      isAvailable={item.availability}
                      handleUpdateItem={(name, price, image) =>
                        updateItemInCreate(item.itemId, name, price, image)
                      }
                    />
                  </div>
                </>
              ) : null;
            })}

            {items.map((item) => {
              return !forCart || (forCart && item.qty > 0) ? (
                <>
                  {isEditItem == item.itemId && (
                    <button
                      className={styles["add-item-button"]}
                      onClick={() => editItem(0)}
                      style={{ display: "inline-block" }}
                    >
                      ↩
                    </button>
                  )}
                  <div className={styles["itemWrapper"]}>
                    {isEditMode && isEditItem != item.itemId && (
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
                      isBeingEdit={isEditItem == item.itemId}
                      isAvailable={item.availability}
                      handleUpdateItem={(name, price, image) =>
                        onUpdateItem(item.itemId, name, price, image)
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
                <span></span>
              </div>
              <div className={styles.OptionContainer}>
                <span>sembunyikan semua</span>
                <span>
                  <Switch
                    onChange={() => setIsVisible(!isVisible)}
                    checked={!isVisible}
                  />
                </span>
              </div>
              <button onClick={handleSaveType} className={styles.PayButton}>
                {false ? (
                  <ColorRing height="50" width="50" color="white" />
                ) : (
                  "Simpan"
                )}
              </button>
              <div className={styles.Pay2Button} onClick={resetItems}>
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
