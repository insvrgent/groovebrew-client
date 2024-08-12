import React, { useState } from "react";
import "./ItemTypeLister.css";
import ItemType from "./ItemType";
import { createItemType } from "../helpers/itemHelper.js";

const ItemTypeLister = ({ shopId, shopOwnerId, user, itemTypes }) => {
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
          <ItemType name={"All"} imageUrl={"uploads/1718732420960.png"} />
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
                />
              )
          )}
        {user &&
          user.roleId == 1 &&
          user.userId == shopOwnerId &&
          isAddingNewItem && (
            <ItemType blank={true} name={"blank"} onCreate={handleCreate} />
          )}
        {!isAddingNewItem &&
          user &&
          user.roleId == 1 &&
          user.userId == shopOwnerId && (
            <ItemType
              onClick={toggleAddNewItem}
              name={"create"}
              imageUrl={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnd07OYAm1f7T6JzziFU7U8X1_IL3bADiVrg&usqp=CAU"
              }
            />
          )}
      </div>
    </div>
  );
};

export default ItemTypeLister;
