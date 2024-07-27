import React, { useState } from 'react';
import './ItemTypeLister.css';
import ItemType from './ItemType';
import { createItemType } from '../helpers/itemHelper.js';

const ItemTypeLister = ({ shopId, user, itemTypes }) => {
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);

  const toggleAddNewItem = () => {
    console.log("aaa")
    setIsAddingNewItem(prev => !prev);
  };

  async function handleCreate(name, selectedImage) {
    createItemType(shopId, name, selectedImage);
  };

  return (
    <div className="item-type-lister">
      <div className="item-type-list">
        {itemTypes && itemTypes.length > 1 &&
          <ItemType name={"All"} imageUrl={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEX///8BAQEEBAT09PT8/PzFxcWGhobu7u7R0dHLy8uoqKhTU1N7e3tXV1fIyMguLi7d3d08PDyenp41NTWBgYF1dXVHR0dMTEwTExPj4+O6urrp6emWlpasrKy2trZeXl4aGhrSJRZxAAADF0lEQVR4nO3Zi3aiMBCAYQIR71VbtXft+z/lJoFigAkNbYHdPf/X3VPqGeMkwdxIEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT0dGBVaSOe5vuV/4giqR1mXOPXL6M1X4r9Cn5l+kqCx3R2Nq7igjWPYoeWjbPkpg09LdiJ/dyPK3P22O+iIid5ZvtebvJZxGxi/y4Pa9Px5efJvh99i56fVM3q+4RJFv5seHeseVqP/btdYDsY5hE7nZVGqn5/7jvqOHiUASVDsE+NyXsH5UfvLub4qtoP/Hd5lEkYn+Zf+Fb9d7lXAa73/fB2KUryytZvQ9Qgy9pm3TqNbW7WAai72udojqruKwq5sdOMJ4ub51SXNnrp2cxdqH8YHcd7PHnp7J+foebphu9inMl+pAyyQ5i7KE13Nj3ftQ6sDIfvkoNef22U59fmoswKqzaCTurRqz942ILaZZs/j6OVrPS805o6dS8dG3Uz65fAhVUqrG6MROFvkpdaF7ZjT1nvAj5Fm2/b1VxpsSszc+s2d96r+rf2Fv02FP/SeoSl9ildZfmUtLulbxV7kW6+Z3TOBWrVBVqWbdiN3LKxqYVuxbj3CeNUS2PON45D80+zLbBGm6z5lDzEIg0Hzdm9ZIkPHioXTN0/hiMPbfmgF0wlj78be5TxVz+l+/hSZ7vVXMstXuh7rFU14IvwaYbeyztmg/rd6mdD8UZLm3Nhzo8H6rR50N5TWN+rllz2dZjTZPYNU0qr2nkNf2AOtalPleBjnVpy0Uaw8TFwdCkvUVq9xaC6L2F9SG3xuh7C11uVG91c20fuT9UX+wPG7vlNLy1HtDnHr/KojORnnv81LtVXbmT7PHdOU119FL8Crd0/3Mav+RJzmnks7bwAbx/1pb+C2dthZ+cl4aO9l0prfPSCQ/2izPvzQBn3pupz7wL3vOFqEczsc8tkuSveW5RinqcJF/Lwf7TxsmfPcWmoIWrUGjt+eF3Uvolfdq3Pg71ehsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACASfwBIesXINu4PFgAAAAASUVORK5CYII="} />
        }
        {itemTypes && itemTypes.map(itemType => (
          (user && user.roleId == 1 || itemType.itemList.length > 0) && (
            <ItemType
              key={itemType.itemTypeId}
              name={itemType.name}
              imageUrl={itemType.image}
            />
          )
        ))}
        {user && user.roleId == 1 && isAddingNewItem &&
          <ItemType blank={true} name={"blank"} onCreate = {handleCreate} />
        }
        {user && user.roleId == 1 &&
          <ItemType onClick = {toggleAddNewItem} name={"create"} imageUrl={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnd07OYAm1f7T6JzziFU7U8X1_IL3bADiVrg&usqp=CAU"} />
        }
      </div>
    </div>
  );
}

export default ItemTypeLister;
