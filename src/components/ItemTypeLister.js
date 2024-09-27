import React, { useState } from "react";
import "./ItemTypeLister.css";
import ItemType from "./ItemType";
import { createItemType } from "../helpers/itemHelper.js";

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

  const toggleAddNewItem = () => {
    console.log("aaa");
    setIsAddingNewItem((prev) => !prev);
  };

  async function handleCreate(name, selectedImage) {
    createItemType(shopId, name, selectedImage);
  }

  return (
    <div className="item-type-lister">
      <div className="item-type-list">
        {itemTypes && itemTypes.length > 1 && (
          <ItemType
            name={"All"}
            onClick={() => onFilterChange(0)}
            imageUrl={"uploads/1718732420960.png"}
          />
        )}
        {itemTypes &&
          itemTypes.map(
            (itemType) =>
              ((user && user.roleId == 1 && user.userId == shopOwnerId) ||
                itemType.itemList.length > 0) && (
                <ItemType
                  key={itemType.itemTypeId}
                  name={itemType.name}
                  imageUrl={itemType.image}
                  onClick={() => onFilterChange(itemType.itemTypeId)}
                  selected={filterId == itemType.itemTypeId}
                />
              )
          )}
        {user &&
          user.roleId == 1 &&
          user.userId == shopOwnerId &&
          isAddingNewItem && (
            <ItemType blank={true} name={"blank"} onCreate={handleCreate} />
          )}
        {isEditMode &&
          !isAddingNewItem &&
          user &&
          user.roleId == 1 &&
          user.userId == shopOwnerId && (
            <ItemType
              onClick={toggleAddNewItem}
              name={"create"}
              imageUrl={"uploads/addnew.png"}
            />
          )}
      </div>
    </div>
  );
};

export default ItemTypeLister;
