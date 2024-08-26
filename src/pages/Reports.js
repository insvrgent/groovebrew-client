import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { getFavourite, getAnalytics } from "../helpers/transactionHelpers.js";
import CircularDiagram from "./CircularDiagram";
import styles from "./Transactions.module.css";

const RoundedRectangle = ({ bgColor, title, value, percentage }) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "calc(100% / 2 - 10px)",
    maxWidth: "250px",
    height: "auto",
    borderRadius: "15px",
    padding: "20px",
    margin: "5px",
    textAlign: "left",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  };

  const titleStyle = {
    fontWeight: "bold",
    marginBottom: "10px",
    width: "100%",
  };

  const valueAndPercentageContainerStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  };

  const valueStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    flex: "1",
    textAlign: "left",
  };

  const percentageStyle = {
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    textAlign: "right",
  };

  const arrowStyle = {
    marginLeft: "5px",
  };

  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: bgColor,
      }}
    >
      <div style={titleStyle}>{title}</div>
      <div style={valueAndPercentageContainerStyle}>
        <div style={valueStyle}>{value}</div>
        <div
          style={{
            ...percentageStyle,
            color: percentage > 0 ? "#007bff" : "red",
          }}
        >
          {percentage}%
          <span style={arrowStyle}>{percentage > 0 ? "↗" : "↘"}</span>
        </div>
      </div>
    </div>
  );
};

const App = ({ cafeId }) => {
  const [favouriteItems, setFavouriteItems] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("monthly"); // Default filter is 'monthly'
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const items = await getFavourite(cafeId);
        const analyticsData = await getAnalytics(cafeId);
        if (items) setFavouriteItems(items);
        if (analyticsData) setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cafeId]);

  useEffect(() => {
    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }

      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);

      return `rgba(${r}, ${g}, ${b}, 1)`;
    };

    const colors = favouriteItems[filter]?.map(() => getRandomColor()) || [];
    setColors(colors);
  }, [favouriteItems, filter]);

  if (loading)
    return (
      <div className="Loader">
        <div className="LoaderChild">
          <ThreeDots />
        </div>
      </div>
    );

  const [sold, percentage] = analytics[filter] || [0, 0];
  const filteredItems = favouriteItems[filter] || [];

  const totalSold = filteredItems.reduce((sum, item) => sum + item.sold, 0);

  const segments = filteredItems.map((item, index) => ({
    value: item.sold,
    color: colors[index] || "#cccccc",
  }));

  return (
    <div className={styles.Transactions} style={{ backgroundColor: "#cfcfcf" }}>
      <h2 className={styles["Transactions-title"]}>Reports</h2>
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <div>
          <label>
            <input
              type="radio"
              name="filter"
              value="daily"
              checked={filter === "daily"}
              onChange={() => setFilter("daily")}
            />
            Daily
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="filter"
              value="weekly"
              checked={filter === "weekly"}
              onChange={() => setFilter("weekly")}
            />
            Weekly
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="filter"
              value="monthly"
              checked={filter === "monthly"}
              onChange={() => setFilter("monthly")}
            />
            Monthly
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="filter"
              value="yearly"
              checked={filter === "yearly"}
              onChange={() => setFilter("yearly")}
            />
            Yearly
          </label>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "20px",
            padding: "20px",
          }}
        >
          <RoundedRectangle
            bgColor="#E3F5FF"
            title="Transactions"
            value={sold}
            percentage={percentage}
          />
          {filteredItems[0]?.Item != undefined && (
            <RoundedRectangle
              bgColor="#E5ECF6"
              title={filteredItems[0]?.Item.name}
              value={filteredItems[0]?.sold}
              percentage={filteredItems[0]?.percentageByPreviousPeriod}
            />
          )}
          {filteredItems[0]?.Item == undefined && (
            <RoundedRectangle bgColor="#E5ECF6" value={"No item"} />
          )}
          <RoundedRectangle
            bgColor="#E5ECF6"
            title="Transactions"
            value={sold}
            percentage={percentage}
          />
          <RoundedRectangle
            bgColor="#E3F5FF"
            title="Transactions"
            value={sold}
            percentage={percentage}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <div style={{ flex: 1 }}>
            <CircularDiagram segments={segments} />
          </div>
          <div style={{ flex: 1, marginLeft: "20px" }}>
            {filteredItems.map((item, index) => (
              <h6
                key={item.itemId}
                style={{
                  textAlign: "left",
                  color: colors[index],
                  margin: "5px 0",
                }}
              >
                {item.Item.name}: {item.sold}
              </h6>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
