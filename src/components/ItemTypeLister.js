import React, { useState, useRef, useEffect } from "react";
import smoothScroll from "smooth-scroll-into-view-if-needed";
import "./ItemTypeLister.css";
import ItemType from "./ItemType";
import { createItemType } from "../helpers/itemHelper.js";
import { getImageUrl } from "../helpers/itemHelper";

const ItemTypeLister = ({
  shopId,
  shopOwnerId,
  user,
  itemTypes,
  onFilterChange,
  filterId,
  isEditMode,
}) => {
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const newItemDivRef = useRef(null);

  // Effect to handle changes to isAddingNewItem
  useEffect(() => {
    if (isAddingNewItem && newItemDivRef.current) {
      // Use smooth-scroll-into-view-if-needed to scroll to the target div
      smoothScroll(newItemDivRef.current, {
        behavior: "smooth",
        block: "start", // Adjust this based on your needs
        inline: "nearest",
      });
    } else {
      const node = document.getElementById("header");

      smoothScroll(node, {
        behavior: "smooth",
        block: "start", // Adjust this based on your needs
        inline: "nearest",
      });
    }
  }, [isAddingNewItem]); // Dependency array includes isAddingNewItem

  const toggleAddNewItem = () => {
    setIsAddingNewItem((prev) => !prev);

    // Set body overflow style based on state
    document.body.style.overflow = !isAddingNewItem ? "hidden" : "auto";
  };

  async function handleCreate(name, selectedImage) {
    createItemType(shopId, name, selectedImage);
  }

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageUrl, setImaguUrl] = useState("");

  useEffect(() => {
    // if (selectedImage) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setPreviewUrl(reader.result);
    //   };
    //   reader.readAsDataURL(selectedImage);
    // } else {
    // setPreviewUrl(getImageUrl(imageUrl));
    setPreviewUrl(selectedImage);
    // }
  }, [selectedImage, imageUrl]);
  const handleImageChange = (e) => {
    setSelectedImage(e);
  };
  return (
    <div
      className="item-type-lister"
      style={{ overflowX: isAddingNewItem ? "hidden" : "" }}
    >
      <div ref={newItemDivRef} className="item-type-list" style={{display: isAddingNewItem?'block':'inline-flex'}}>
        {isEditMode &&
          !isAddingNewItem &&
          user &&
          user.roleId === 1 &&
          user.userId === shopOwnerId && (
            <ItemType
              onClick={toggleAddNewItem}
              name={"create"}
              imageUrl={"uploads/addnew.png"}
            />
          )}
        {user &&
          user.roleId === 1 &&
          user.userId === shopOwnerId &&
          isAddingNewItem && (
            <>
              <ItemType
                blank={true}
                imageUrl={previewUrl}
                name={"blank"}
                onCreate={handleCreate}
              />
              <div className="rect-creator">
                <div
                  className="grid-container"
                  style={{ visibility: "hidden" }}
                >
                  <ItemType
                    onClick={() => onFilterChange(0)}
                    imageUrl={"uploads/1718732420960.png"}
                  />
                  <ItemType
                    onClick={() => onFilterChange(0)}
                    imageUrl={"uploads/1718732420960.png"}
                  />
                  <ItemType
                    onClick={() => onFilterChange(0)}
                    imageUrl={"uploads/1718732420960.png"}
                  />
                  <ItemType
                    onClick={() => onFilterChange(0)}
                    imageUrl={"uploads/1718732420960.png"}
                  />
                </div>
                <div className="grid-container" style={{ paddingTop: "15px" }}>
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/beverage1.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/beverage2.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/beverage3.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/dessert1.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/dessert2.jpg"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/food1.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/food2.jpg"}
                  />

                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/food3.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/packet1.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/packet2.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/snack1.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/snack2.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/snack3.png"}
                  />
                  <ItemType
                    rectangular={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/snack4.png"}
                  />
                  <ItemType
                    rectangular={true}
                    blank={true}
                    onClick={(e) => handleImageChange(e)}
                    imageUrl={"uploads/addnew.png"}
                  />
                </div>
                <button onClick={toggleAddNewItem} className="add-button">
                  back
                </button>
              </div>

              <h1>please select the icon</h1>
            </>
          )}
        {itemTypes && itemTypes.length > 0 && (
          <ItemType
            name={"All"}
            onClick={() => onFilterChange(0)}
            imageUrl={"uploads/1718732420960.png"}
          />
        )}
        {itemTypes &&
          itemTypes.map(
            (itemType) =>
              ((user && user.roleId === 1 && user.userId === shopOwnerId) ||
                itemType.itemList.length > 0) && (
                <ItemType
                  key={itemType.itemTypeId}
                  name={itemType.name}
                  imageUrl={itemType.image}
                  onClick={() => onFilterChange(itemType.itemTypeId)}
                  selected={filterId === itemType.itemTypeId}
                />
              )
          )}
      </div>
    </div>
  );
};

export default ItemTypeLister;
