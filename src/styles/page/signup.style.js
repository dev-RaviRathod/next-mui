"use client";

import styled from "@emotion/styled";
import { mediaQueries } from "../../utils/mediaQuery";
// import styled from "styled-components";
import { theme } from "../global/theme";

export const LoginLayoutWrapper = styled.div`
  background: ${theme.color.lightyellow};
  min-height: 100vh;
  padding: 80px 0 80px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  .right-top-img-div {
    max-width: 730px;
    height: 280px;
    overflow: hidden;
    width: 100%;
    position: absolute;
    right: -330px;
    top: -90px;
    ${mediaQueries("lg")`
      right: -280px;
      top: -50px;
      height: 210px;
    `}
    img {
      object-fit: contain;
    }
    &.left-top-img-div {
      left: -470px;
      right: auto;
      top: 30%;
      ${mediaQueries("lg")`
      left: -340px;
      right: auto;
      top: 30%;
      height: 160px;
    `}
    }
    &.right-button-img-div {
      right: -220px;
      top: auto;
      bottom: -55px;
      &.center-bottom-img {
        left: 0;
        right: 0;
        margin: auto;
        ${mediaQueries("lg")`
          max-width: 380px;
          height: 180px;
        `}
      }
    }
  }
  .account-text-link {
    margin-top: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
    h5 {
      color: ${theme.color.secondary};
      text-align: center;
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      line-height: normal; /* 21px */
      letter-spacing: 0.15px;
      ${mediaQueries("lg")`
        font-size: 14px;
      `}
      a {
        color: ${theme.color.secondary};
        font-size: 15px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 0.15px;
        text-decoration-line: underline !important;
        display: inline-block;
        ${mediaQueries("lg")`
          font-size: 14px;
        `}
      }
    }
  }
  &.privacy-layout-footer {
  }
`;
