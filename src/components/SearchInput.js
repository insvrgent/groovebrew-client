import React, { useState } from 'react';
import styled from 'styled-components';

// Styled component for the search box container
const SearchBox = styled.div`
    display: flex;
    align-items: center;
    padding: 5px;
`;

// Styled component for the container of input and icon
const SearchContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin: 0px 10px;
`;

// Styled component for the input field
const Searchinput = styled.input`
    flex-grow: 1;
    border: none;
    border-radius: 25px;
    padding: 12px 40px;
    font-size: 16px;
    outline: none;
    background-color: white;
    border: 1px solid #ccc; /* Add border to the input field */
    transition: background-color 0.3s ease, border-color 0.3s ease; /* Add transition effect */

    &:focus {
        background-color: lightgray; /* Change background color when focused */
    }
`;

// Styled component for the search icon
const SearchIcon = styled.svg`
    position: absolute;
    left: 10px;
    fill: #888;
    width: 20px;
    height: 20px;
    pointer-events: none;
`;

// Adjust icon hover state
SearchContainer.hover = styled(SearchContainer)`
    ${SearchIcon} {
        fill: #555;
    }
`;

export default function SearchInput() {
    const [currentTime, setCurrentTime] = useState(0);

    return (
        <SearchBox>
            <SearchContainer>
                <Searchinput type="text" placeholder="Search..." />
                <SearchIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M20.8333 18.3333H19.5167L19.05 17.8833C20.6833 15.9833 21.6667 13.5167 21.6667 10.8333C21.6667 4.85 16.8167 0 10.8333 0C4.85 0 0 4.85 0 10.8333C0 16.8167 4.85 21.6667 10.8333 21.6667C13.5167 21.6667 15.9833 20.6833 17.8833 19.05L18.3333 19.5167V20.8333L26.6667 29.15L29.15 26.6667L20.8333 18.3333ZM10.8333 18.3333C6.68333 18.3333 3.33333 14.9833 3.33333 10.8333C3.33333 6.68333 6.68333 3.33333 10.8333 3.33333C14.9833 3.33333 18.3333 6.68333 18.3333 10.8333C18.3333 14.9833 14.9833 18.3333 10.8333 18.3333Z"
                    />
                </SearchIcon>
            </SearchContainer>
        </SearchBox>
    );
}
