import { styled } from "styled-components";

export const GroupButtonWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

export const accordionCustomStyle = `
  .accordion {
    background-color: transparent;
  }

  .accordion-header {
    background-color: transparent;
  }

  .accordion-item {
    background-color: transparent;
    border: 0;
  }

  .accordion-button {
    background-color: transparent;
    border: 0 !important;
    padding: 5px 0;
    --bs-accordion-border-width: 0;
  }

  .accordion-button:focus {
    outline: 0;
    border: 0;
    box-shadow: unset;
  }
  
  .accordion-button:active {
    outline: none;
    border: none;
  }

  .accordion-button:not(.collapsed) {
    color: #3e3e3e;
    --bs-accordion-active-bg: transparent;
  }

  .accordion-button:hover {
    color: #5e5e5e;
  }
  
  .accordion-button::after {
    all: unset;
  }

  .accordion-body {
    padding: 5px 0;
  }
  .accordion-collapse .collapsing {
    overflow: auto;
  }
`;