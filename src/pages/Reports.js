import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import {
  getFavourite,
  getAnalytics,
  getIncome,
} from "../helpers/transactionHelpers.js";
import CircularDiagram from "./CircularDiagram";
import styles from "./Transactions.module.css";
import "./Switch.css";

import MultiSwitch from "react-multi-switch-toggle";

const RoundedRectangle = ({
  onClick,
  bgColor,
  title,
  value,
  percentage,
  fontSize = "15px",
  loading = false,
}) => {
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
    backgroundColor: loading ? "rgb(127 127 127)" : bgColor,
  };

  const titleStyle = {
    fontWeight: "bold",
    marginBottom: "10px",
    width: "100%",
    backgroundColor: loading ? "rgb(85 85 85)" : "inherit",
    color: loading ? "transparent" : "inherit",
  };

  const valueAndPercentageContainerStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  };

  const valueStyle = {
    fontSize: loading ? "15px" : fontSize,
    fontWeight: "bold",
    flex: "1",
    textAlign: "left",
    color: loading ? "transparent" : "inherit",
    backgroundColor: loading ? "rgb(85 85 85)" : "transparent",
    overflow: "hidden",
    textOverflow: "ellipsis", // Add ellipsis for overflow text
    whiteSpace: "nowrap", // Prevent text from wrapping
  };

  const percentageStyle = {
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    textAlign: "right",
    color: loading ? "black" : percentage > 0 ? "#007bff" : "red",
  };

  const arrowStyle = {
    marginLeft: "5px",
  };

  return (
    <div style={containerStyle} onClick={onClick}>
      <div style={titleStyle}>{title}</div>
      <div style={valueAndPercentageContainerStyle}>
        <div style={valueStyle}>{loading ? "Loading..." : value}</div>
        <div
          style={{
            ...percentageStyle,
          }}
        >
          {loading ? "" : percentage}
          {percentage != undefined && !loading && "%"}
          {percentage != undefined && !loading && (
            <span style={arrowStyle}>
              {percentage > 0 ? "↗" : percentage === 0 ? "-" : "↘"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const App = ({ cafeId }) => {
  const [favouriteItems, setFavouriteItems] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("daily");
  const [viewStock, setViewStock] = useState(false);

  const fetchData = async (filter) => {
    try {
      setLoading(true);
      // Fetch the analytics data with the selected filter
      const analyticsData = await getAnalytics(cafeId, filter);
      console.log(analyticsData);
      if (analyticsData) setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filter); // Fetch data when filter changes
  }, [filter]);

  const [sold, percentage] = analytics[filter] || [0, 0];
  const filteredItems = analytics.currentFavoriteItems || [];

  const totalSold = filteredItems.reduce((sum, item) => sum + item.count, 0);
  const colors = [
    "#FF0000", // Red
    "#FF6F00", // Dark Orange
    "#FFD700", // Gold
    "#32CD32", // Lime Green
    "#00CED1", // Dark Turquoise
    "#1E90FF", // Dodger Blue
    "#8A2BE2", // BlueViolet
    "#FF00FF", // Magenta
    "#FF1493", // Deep Pink
    "#FF4500", // OrangeRed
    "#FFDAB9", // Peach Puff
    "#4B0082", // Indigo
    "#00FF7F", // Spring Green
    "#C71585", // Medium Violet Red
    "#F0E68C", // Khaki
    "#FF6347", // Tomato
    "#006400", // Dark Green
    "#8B4513", // SaddleBrown
    "#00BFFF", // Deep Sky Blue
    "#FF69B4", // Hot Pink
  ];

  const segments = filteredItems.map((item, index) => ({
    percentage: item.percentage,
    color: colors[index] || "#cccccc",
  }));

  const formatIncome = (amount) => {
    if (amount >= 1_000_000_000) {
      // Format for billions
      const billions = amount / 1_000_000_000;
      return billions.toFixed(0) + "b"; // No decimal places for billions
    } else if (amount >= 1_000_000) {
      // Format for millions
      const millions = amount / 1_000_000;
      return millions.toFixed(2).replace(/\.00$/, "") + "m"; // Two decimal places, remove trailing '.00'
    } else if (amount >= 1_000) {
      // Format for thousands
      const thousands = amount / 1_000;
      return thousands.toFixed(1).replace(/\.0$/, "") + "k"; // One decimal place, remove trailing '.0'
    } else {
      // Less than a thousand
      if (amount != null) return amount.toString();
    }
  };

  function roundToInteger(num) {
    return Math.round(num);
  }

  function onToggle(selectedItem) {
    const filterMap = ["daily", "weekly", "monthly", "yearly"];
    setFilter(filterMap[selectedItem]);
  }

  const filterTexts = ["1 day", "7 days", "30 days", "365 days"];
  const comparisonText =
    filterTexts[["daily", "weekly", "monthly", "yearly"].indexOf(filter)];

  return (
    <div className={styles.Transactions} style={{ backgroundColor: "#cfcfcf" }}>
      <h2 className={styles["Transactions-title"]}>Reports</h2>
      <div style={{ textAlign: "center" }}>
        <MultiSwitch
          texts={["Yesterday", "Last 7", "Last 30", "Last 365"]}
          selectedSwitch={["daily", "weekly", "monthly", "yearly"].indexOf(
            filter
          )}
          borderWidth={0}
          bgColor={"rgb(229, 236, 246)"}
          onToggleCallback={onToggle}
          fontColor={"rgba(88, 55, 50, 1)"}
          selectedFontColor={"#1e311b"}
          selectedSwitchColor={"rgb(227, 245, 255)"}
          eachSwitchWidth={70}
          height={"25px"}
          fontSize={"12px"}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <RoundedRectangle
            bgColor="#E3F5FF"
            title="Transactions"
            value={analytics.transactionCount}
            percentage={roundToInteger(analytics.transactionGrowth)}
            loading={loading}
          />
          <RoundedRectangle
            bgColor="#E5ECF6"
            title="Income"
            fontSize="12px"
            value={!loading && "Rp" + formatIncome(analytics?.totalIncome)}
            percentage={roundToInteger(analytics.incomeGrowth)}
            loading={loading}
          />

          {analytics?.currentFavoriteItems &&
            analytics?.currentFavoriteItems.length > 0 && (
              <RoundedRectangle
                bgColor="#E5ECF6"
                title={"Fav item"}
                value={analytics?.currentFavoriteItems[0]?.name}
                loading={loading}
              />
            )}
          {(!analytics?.currentFavoriteItems ||
            analytics?.currentFavoriteItems.length === 0) && (
            <RoundedRectangle
              bgColor="#E5ECF6"
              title={"No fav item"}
              value={"-"}
              loading={loading}
            />
          )}
          {analytics?.previousFavoriteItem !== null && (
            <RoundedRectangle
              bgColor="#E3F5FF"
              title={"Fav before"}
              value={analytics?.previousFavoriteItem?.name}
              loading={loading}
            />
          )}
          {analytics?.previousFavoriteItem === null && (
            <RoundedRectangle
              bgColor="#E3F5FF"
              title={"No fav item"}
              value={"-"}
              loading={loading}
            />
          )}

          <div
            style={{ display: "flex", alignItems: "center", margin: "10px" }}
          >
            <div style={{ marginRight: "5px", fontSize: "1.2em" }}>ⓘ</div>
            <h6 style={{ margin: 0, textAlign: "left" }}>
              Growth percentages are based on comparing the last{" "}
              {comparisonText} with the preceding {comparisonText}.
            </h6>
          </div>
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
              
          <div
          style={{ display: "flex", alignItems: "center", margin: "10px" }}
        >
          <div style={{ marginRight: "5px", fontSize: "1.2em", color: colors[index] }}>★</div>
          <h5 style={{ margin: 0, textAlign: "left" }}>
          {item.name}
          </h5>
        </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
