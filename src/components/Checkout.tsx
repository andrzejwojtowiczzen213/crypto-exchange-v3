"use client";
import React, { useState, CSSProperties, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface LocationState {
  selectedAsset: string;
  assetValue: string;
  mode: 'buy' | 'sell';
  selectedCurrency?: 'EUR' | 'USD';
  price?: string;
  fiatValue?: string;
  focusField?: 'fiat' | 'asset';
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [selectedAsset, setSelectedAsset] = useState(state?.selectedAsset || 'BTC');
  const [assetValue, setAssetValue] = useState(state?.assetValue || '0');
  const [mode] = useState<'buy' | 'sell'>(state?.mode || 'buy');
  const [isFeesDrawerOpen, setIsFeesDrawerOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'USD'>(state?.selectedCurrency || 'USD');
  const [fiatValue, setFiatValue] = useState(state?.fiatValue || '844');

  const getExactPrice = () => {
    const rates = {
      BTC: {
        EUR: '84,426.20',
        USD: '91,855.71'
      },
      ETH: {
        EUR: '1,940.21',
        USD: '2,110.95'
      },
      SOL: {
        EUR: '148.32',
        USD: '161.37'
      }
    };
    
    return rates[selectedAsset as keyof typeof rates]?.[selectedCurrency] || '0';
  };

  const formatFiat = (value: string) => {
    const numericValue = parseFloat(value.replace(/[€$,]/g, ''));
    if (isNaN(numericValue)) return selectedCurrency === 'EUR' ? '€0' : '$0';
    const symbol = selectedCurrency === 'EUR' ? '€' : '$';
    
    // Always format with thousands separator
    return `${symbol}${numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true
    })}`;
  };

  const containerStyles = {
    width: '393px',
    height: '677px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const navBarStyles = {
    width: '100%',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 0 16px',
    background: '#FFFFFF',
  };

  const navBarTextStyles = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '-0.09px',
    color: '#1E1E1E',
    textAlign: 'center' as const,
    flex: 1,
  };

  const navBarValueStyles = {
    fontWeight: 600,
  };

  const iconContainerStyles = {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backButtonStyles = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(245, 247, 250, 0.01)',
    borderRadius: '640px',
    cursor: 'pointer',
  };

  const assetInfoStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2px',
    padding: '24px 16px',
  };

  const assetTextStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px',
    cursor: 'pointer',
    fontSize: '30px',
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    fontStyle: 'normal',
    lineHeight: '36px',
    letterSpacing: '-0.09px',
    textAlign: 'center' as const,
  };

  const buyingTextStyles = {
    color: 'rgba(107, 114, 128, 1)',
    fontWeight: 500,
  };

  const valueTextStyles = {
    color: 'rgba(30, 30, 30, 1)',
    fontWeight: 700,
    fontSize: '30px',
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    lineHeight: '24px',
  };

  const walletAndPaymentContainerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '0px',
    alignSelf: 'stretch',
    margin: '0 16px',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    background: '#FFFFFF',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  };

  const sectionStyles = {
    display: 'flex',
    padding: '12px',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '8px',
    alignSelf: 'stretch',
    width: '100%',
  };

  const dividerStyles = {
    width: '100%',
    height: '1px',
    backgroundColor: '#F3F4F6',
    margin: '4px 0',
  };

  const labelStyles = {
    color: '#6B7280',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '20px',
  };

  const valueStyles = {
    color: '#1E1E1E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
  };

  const addressContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const bankTransferContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const assetIconSmallStyles = {
    width: '24px',
    height: '24px',
  };

  const cardFooterStyles = {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  };

  const feesTextContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  };

  const feesTextStyles = {
    color: '#1E1E1E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  };

  const buttonStyles = {
    display: 'flex',
    width: '361px',
    minHeight: '48px',
    maxHeight: '48px',
    padding: '12px 16px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '8px',
    background: 'rgb(4, 145, 71)',
    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  };

  const footerTextStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: 'rgb(30, 30, 30)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '16px',
  };

  const footerBoldTextStyles = {
    fontWeight: 500,
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const handleAssetClick = () => {
    navigate('/', { 
      state: { 
        selectedAsset, 
        assetValue,
        mode,
        selectedCurrency,
        price: fiatValue,
        fiatValue: fiatValue,
        focusField: 'asset'
      } 
    });
  };

  const handleFeesClick = () => {
    setIsFeesDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsFeesDrawerOpen(false);
  };

  const calculateNetworkFee = () => {
    const numericValue = parseFloat(fiatValue.replace(/[€$,]/g, ''));
    const networkFeeRate = 0.001; // 0.1% for all assets
    const networkFee = numericValue * networkFeeRate;
    return networkFee.toFixed(2);
  };

  const calculateProcessingFee = () => {
    console.log('Fiat Value:', fiatValue);
    console.log('Selected Asset:', selectedAsset);
    const numericValue = parseFloat(fiatValue.replace(/[€$,]/g, ''));
    console.log('Numeric Value:', numericValue);
    const processingFeeRate = 0.005; // 0.5% for all assets
    console.log('Processing Fee Rate:', processingFeeRate);
    const processingFee = numericValue * processingFeeRate;
    console.log('Processing Fee:', processingFee);
    return processingFee.toFixed(2);
  };

  const calculateTotalFees = () => {
    const processingFee = parseFloat(calculateProcessingFee());
    const networkFee = mode === 'buy' ? parseFloat(calculateNetworkFee()) : 0;
    return (processingFee + networkFee).toFixed(2);
  };

  const overlayStyles: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 2,
    opacity: isDrawerOpen || isFeesDrawerOpen ? 1 : 0,
    visibility: isDrawerOpen || isFeesDrawerOpen ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
  };

  const drawerStyles: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    padding: '16px',
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  const feesDrawerStyles: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    padding: '16px',
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  const feesOptionStyles = {
    display: 'flex',
    minWidth: 'var(--units-unit-60, 240px)',
    minHeight: '32px',
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--units-unit-1, 4px)',
    alignSelf: 'stretch',
  };

  const feesLabelStyles = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    color: '#1E1E1E',
  };

  const feesValueStyles = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    color: '#1E1E1E',
  };

  const closeButtonStyles = {
    width: '48px',
    height: '48px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#F3F4F6',
    },
    margin: '0',
    padding: '12px'
  };

  const handleCurrencyClick = (currency: 'EUR' | 'USD') => {
    setSelectedCurrency(currency);
    setIsDrawerOpen(false);
  };

  const currencyOptionStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '12px 0',
    cursor: 'pointer',
  };

  const currencyContentStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const currencyTextStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  };

  const currencyTitleStyles = {
    color: '#1E1E1E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
  };

  const currencySubtitleStyles = {
    color: '#6B7280',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
  };

  const currencyTextContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  };

  const totalTextStyles = {
    color: '#1E1E1E',
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '24px',
    textAlign: 'left' as const,
  };

  const feesContainerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0px',
    width: '100%',
  };

  const feesContainerRowStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  };

  const leftColumnStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0px',
  };

  const fiatTextStyles = {
    color: '#1E1E1E',
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    fontSize: '38px',
    fontWeight: 700,
    lineHeight: '36px',
    textAlign: 'right' as const,
    marginTop: '-6px',
    padding: '8px',
    cursor: 'pointer',
  };

  const handleFiatClick = () => {
    navigate('/', { 
      state: { 
        selectedAsset, 
        assetValue,
        mode,
        selectedCurrency,
        fiatValue,
        focusField: 'fiat'
      } 
    });
  };

  const handleContinue = () => {
    // Remove navigation to status page
    console.log('Transaction completed');
  };

  return (
    <div style={containerStyles}>
      <div style={navBarStyles}>
        <div style={iconContainerStyles}>
          <div style={{
            color: '#1E1E1E',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
            cursor: 'pointer'
          }} onClick={() => navigate('/')}>
            Edit
          </div>
        </div>
        <div style={navBarTextStyles}>Order Summary</div>
        <div style={iconContainerStyles}>
          <div style={backButtonStyles}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <g clip-path="url(#clip0_440_5125)">
                <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#ABBBCE"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M16 21.0602C19.461 21.0602 22.2667 18.256 22.2667 14.7968C22.2667 11.3376 19.461 8.53333 16 8.53333C12.539 8.53333 9.73334 11.3376 9.73334 14.7968C9.73334 18.256 12.539 21.0602 16 21.0602ZM16 41.4165C22.922 41.4165 28.5333 37.2101 28.5333 32.0213C28.5333 26.8325 22.922 22.6261 16 22.6261C9.07804 22.6261 3.46667 26.8325 3.46667 32.0213C3.46667 37.2101 9.07804 41.4165 16 41.4165Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_440_5125">
                  <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div style={assetInfoStyles}>
        <div onClick={handleAssetClick} style={{ cursor: 'pointer' }}>
          {selectedAsset === 'BTC' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="57" height="57" viewBox="0 0 57 57" fill="none">
              <path d="M55.6622 35.2733C51.9222 50.2735 36.7278 59.4023 21.7241 55.6617C6.72681 51.9221 -2.40301 36.7284 1.33865 21.7295C5.07704 6.72773 20.2715 -2.40175 35.2704 1.33786C50.273 5.07746 59.4022 20.2728 55.6618 35.2736L55.6621 35.2733H55.6622Z" fill="#F7931A"/>
              <path d="M41.0305 24.6517C41.5839 20.9005 38.7671 18.884 34.9153 17.5389L36.1648 12.4575L33.114 11.6868L31.8976 16.6344C31.0956 16.4315 30.2719 16.2404 29.4533 16.051L30.6785 11.0707L27.6296 10.3L26.3794 15.3797C25.7157 15.2265 25.0638 15.0751 24.4314 14.9155L24.4349 14.8995L20.2278 13.8344L19.4162 17.1381C19.4162 17.1381 21.6797 17.6641 21.632 17.6965C22.8674 18.0091 23.0908 18.8383 23.0537 19.4955L21.6303 25.2844C21.7154 25.3063 21.8258 25.338 21.9475 25.3876C21.8457 25.362 21.7374 25.334 21.625 25.3067L19.63 33.4161C19.479 33.7967 19.0958 34.3678 18.232 34.1509C18.2626 34.1958 16.0147 33.5899 16.0147 33.5899L14.5 37.1306L18.4701 38.134C19.2087 38.3218 19.9325 38.5183 20.6452 38.7031L19.3828 43.8427L22.4301 44.6135L23.6803 39.5284C24.5128 39.7575 25.3207 39.9689 26.1116 40.1681L24.8656 45.2292L27.9165 46L29.1788 40.87C34.3811 41.8682 38.2928 41.4657 39.9393 36.6949C41.266 32.8538 39.8732 30.6383 37.1363 29.1935C39.1298 28.7274 40.6312 27.3981 41.0316 24.6521L41.0306 24.6514L41.0305 24.6517ZM34.0601 34.5618C33.1173 38.4029 26.7387 36.3265 24.6707 35.8058L26.346 28.9967C28.4139 29.5201 35.0455 30.5559 34.0603 34.5618H34.0601ZM35.0036 24.5961C34.1436 28.0899 28.8346 26.3149 27.1124 25.8796L28.6313 19.7041C30.3535 20.1394 35.8996 20.9517 35.0039 24.5961H35.0036Z" fill="white"/>
            </svg>
          ) : selectedAsset === 'ETH' ? (
            <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28.5" cy="28.5" r="28.5" fill="#627EEA"/>
              <path d="M28.5 8v15.177l12.832 5.731L28.5 8Z" fill="#C0CBF6"/>
              <path d="M28.5 8 15.667 28.908l12.833-5.731V8Z" fill="white"/>
              <path d="M28.5 39.647v9.345l12.837-17.775L28.5 39.647Z" fill="#C0CBF6"/>
              <path d="m28.5 48.992v-9.345l-12.833-8.43L28.5 48.992Z" fill="white"/>
              <path d="m28.5 37.145 12.832-8.237-12.832-5.731v13.968Z" fill="#8197EE"/>
              <path d="m15.667 28.908 12.833 8.237V23.177l-12.833 5.731Z" fill="#C0CBF6"/>
            </svg>
          ) : (
            <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28.5" cy="28.5" r="28.5" fill="#000000"/>
              <path d="M19.319 35.353a.832.832 0 0 1 .587-.243h25.228a.416.416 0 0 1 .294.71l-5.166 5.166a.832.832 0 0 1-.587.243H14.447a.416.416 0 0 1-.294-.71l5.166-5.166Z" fill="url(#a)"/>
              <path d="M19.319 16.243a.832.832 0 0 1 .587-.243h25.228a.416.416 0 0 1 .294.71l-5.166 5.166a.832.832 0 0 1-.587.243H14.447a.416.416 0 0 1-.294-.71l5.166-5.166Z" fill="url(#b)"/>
              <path d="M39.675 25.743a.832.832 0 0 0-.587-.243H13.86a.416.416 0 0 0-.294.71l5.166 5.166a.832.832 0 0 0 .587.243h25.228a.416.416 0 0 0 .294-.71l-5.166-5.166Z" fill="url(#c)"/>
              <defs>
                <linearGradient id="a" x1="42.766" y1="14.657" x2="23.986" y2="48.491" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FFA3"/>
                  <stop offset="1" stopColor="#DC1FFF"/>
                </linearGradient>
                <linearGradient id="b" x1="42.766" y1="14.657" x2="23.986" y2="48.491" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FFA3"/>
                  <stop offset="1" stopColor="#DC1FFF"/>
                </linearGradient>
                <linearGradient id="c" x1="42.766" y1="14.657" x2="23.986" y2="48.491" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FFA3"/>
                  <stop offset="1" stopColor="#DC1FFF"/>
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>
        <div style={assetTextStyles} onClick={handleAssetClick}>
          <span style={buyingTextStyles}>{mode === 'buy' ? 'Buying' : 'Selling'}</span>
          <span style={valueTextStyles}>{assetValue}</span>
          <span style={valueTextStyles}>{selectedAsset}</span>
        </div>
      </div>
      <div style={walletAndPaymentContainerStyles}>
        {mode === 'buy' ? (
          <>
            <div style={sectionStyles}>
              <div style={labelStyles}>Send to</div>
              <div style={addressContainerStyles}>
                {selectedAsset === 'BTC' ? (
                  <svg style={assetIconSmallStyles} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57 57" fill="none">
                    <path d="M55.6622 35.2733C51.9222 50.2735 36.7278 59.4023 21.7241 55.6617C6.72681 51.9221 -2.40301 36.7284 1.33865 21.7295C5.07704 6.72773 20.2715 -2.40175 35.2704 1.33786C50.273 5.07746 59.4022 20.2728 55.6618 35.2736L55.6621 35.2733H55.6622Z" fill="#F7931A"/>
                    <path d="M41.0305 24.6517C41.5839 20.9005 38.7671 18.884 34.9153 17.5389L36.1648 12.4575L33.114 11.6868L31.8976 16.6344C31.0956 16.4315 30.2719 16.2404 29.4533 16.051L30.6785 11.0707L27.6296 10.3L26.3794 15.3797C25.7157 15.2265 25.0638 15.0751 24.4314 14.9155L24.4349 14.8995L20.2278 13.8344L19.4162 17.1381C19.4162 17.1381 21.6797 17.6641 21.632 17.6965C22.8674 18.0091 23.0908 18.8383 23.0537 19.4955L21.6303 25.2844C21.7154 25.3063 21.8258 25.338 21.9475 25.3876C21.8457 25.362 21.7374 25.334 21.625 25.3067L19.63 33.4161C19.479 33.7967 19.0958 34.3678 18.232 34.1509C18.2626 34.1958 16.0147 33.5899 16.0147 33.5899L14.5 37.1306L18.4701 38.134C19.2087 38.3218 19.9325 38.5183 20.6452 38.7031L19.3828 43.8427L22.4301 44.6135L23.6803 39.5284C24.5128 39.7575 25.3207 39.9689 26.1116 40.1681L24.8656 45.2292L27.9165 46L29.1788 40.87C34.3811 41.8682 38.2928 41.4657 39.9393 36.6949C41.266 32.8538 39.8732 30.6383 37.1363 29.1935C39.1298 28.7274 40.6312 27.3981 41.0316 24.6521L41.0306 24.6514L41.0305 24.6517ZM34.0601 34.5618C33.1173 38.4029 26.7387 36.3265 24.6707 35.8058L26.346 28.9967C28.4139 29.5201 35.0455 30.5559 34.0603 34.5618H34.0601ZM35.0036 24.5961C34.1436 28.0899 28.8346 26.3149 27.1124 25.8796L28.6313 19.7041C30.3535 20.1394 35.8996 20.9517 35.0039 24.5961H35.0036Z" fill="white"/>
                  </svg>
                ) : selectedAsset === 'ETH' ? (
                  <svg style={assetIconSmallStyles} viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28.5" cy="28.5" r="28.5" fill="#627EEA"/>
                    <path d="M28.5 8v15.177l12.832 5.731L28.5 8Z" fill="#C0CBF6"/>
                    <path d="M28.5 8 15.667 28.908l12.833-5.731V8Z" fill="white"/>
                    <path d="M28.5 39.647v9.345l12.837-17.775L28.5 39.647Z" fill="#C0CBF6"/>
                    <path d="m28.5 48.992v-9.345l-12.833-8.43L28.5 48.992Z" fill="white"/>
                    <path d="m28.5 37.145 12.832-8.237-12.832-5.731v13.968Z" fill="#8197EE"/>
                    <path d="m15.667 28.908 12.833 8.237V23.177l-12.833 5.731Z" fill="#C0CBF6"/>
                  </svg>
                ) : (
                  <svg style={assetIconSmallStyles} viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28.5" cy="28.5" r="28.5" fill="#000000"/>
                    <path d="M19.319 35.353a.832.832 0 0 1 .587-.243h25.228a.416.416 0 0 1 .294.71l-5.166 5.166a.832.832 0 0 1-.587.243H14.447a.416.416 0 0 1-.294-.71l5.166-5.166Z" fill="url(#a)"/>
                    <path d="M19.319 16.243a.832.832 0 0 1 .587-.243h25.228a.416.416 0 0 1 .294.71l-5.166 5.166a.832.832 0 0 1-.587.243H14.447a.416.416 0 0 1-.294-.71l5.166-5.166Z" fill="url(#b)"/>
                    <path d="M39.675 25.743a.832.832 0 0 0-.587-.243H13.86a.416.416 0 0 0-.294.71l5.166 5.166a.832.832 0 0 0 .587.243h25.228a.416.416 0 0 0 .294-.71l-5.166-5.166Z" fill="url(#c)"/>
                    <defs>
                      <linearGradient id="a" x1="42.766" y1="14.657" x2="23.986" y2="48.491" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FFA3"/>
                        <stop offset="1" stopColor="#DC1FFF"/>
                      </linearGradient>
                      <linearGradient id="b" x1="42.766" y1="14.657" x2="23.986" y2="48.491" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FFA3"/>
                        <stop offset="1" stopColor="#DC1FFF"/>
                      </linearGradient>
                      <linearGradient id="c" x1="42.766" y1="14.657" x2="23.986" y2="48.491" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FFA3"/>
                        <stop offset="1" stopColor="#DC1FFF"/>
                      </linearGradient>
                    </defs>
                  </svg>
                )}
                <div style={valueStyles}>{truncateAddress('0x4983fC1587476B2Fc8874E19e02D6bC085f9f075')}</div>
              </div>
            </div>
            <div style={dividerStyles} />
            <div style={sectionStyles}>
              <div style={labelStyles}>Pay with</div>
              <div style={bankTransferContainerStyles}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 36 24" fill="none">
                  <rect width="36" height="24" rx="4" fill="#DBEAFE"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M27.9999 6.4099C27.9999 6.17156 27.8317 5.96635 27.598 5.91961L18.0981 4.01961C18.0333 4.00667 17.9667 4.00667 17.9019 4.01961L8.40194 5.91961C8.16823 5.96635 8 6.17156 8 6.4099V8.5C8 8.77614 8.22386 9 8.5 9H9.49998C9.77612 9 9.99998 9.22386 9.99998 9.5V15.5C9.99998 15.7761 9.77612 16 9.49998 16H8.5C8.22386 16 8 16.2239 8 16.5V18.5C8 18.7761 8.22386 19 8.5 19H27.5C27.7761 19 28 18.7761 28 18.5V16.5C28 16.2239 27.7761 16 27.5 16H26.5C26.2238 16 26 15.7761 26 15.5V9.5C26 9.22386 26.2238 9 26.5 9H27.4999C27.7761 9 27.9999 8.77614 27.9999 8.5V6.4099ZM22.4999 16C22.7761 16 22.9999 15.7761 22.9999 15.5V9.5C22.9999 9.22386 22.7761 9 22.4999 9H20.5C20.2238 9 20 9.22386 20 9.5V15.5C20 15.7761 20.2238 16 20.5 16H22.4999ZM15.5 16C15.7761 16 16 15.7761 16 15.5V9.5C16 9.22386 15.7761 9 15.5 9H13.5C13.2238 9 13 9.22386 13 9.5L13 15.5C13 15.7761 13.2238 16 13.5 16H15.5Z" fill="#3B82F6"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M27.9999 6.4099C27.9999 6.17156 27.8317 5.96635 27.598 5.91961L18.0981 4.01961C18.0333 4.00667 17.9667 4.00667 17.9019 4.01961L8.40194 5.91961C8.16823 5.96635 8 6.17156 8 6.4099V8.5C8 8.77614 8.22386 9 8.5 9H9.49998C9.77612 9 9.99998 9.22386 9.99998 9.5V15.5C9.99998 15.7761 9.77612 16 9.49998 16H8.5C8.22386 16 8 16.2239 8 16.5V18.5C8 18.7761 8.22386 19 8.5 19H27.5C27.7761 19 28 18.7761 28 18.5V16.5C28 16.2239 27.7761 16 27.5 16H26.5C26.2238 16 26 15.7761 26 15.5V9.5C26 9.22386 26.2238 9 26.5 9H27.4999C27.7761 9 27.9999 8.77614 27.9999 8.5V6.4099ZM22.4999 16C22.7761 16 22.9999 15.7761 22.9999 15.5V9.5C22.9999 9.22386 22.7761 9 22.4999 9H20.5C20.2238 9 20 9.22386 20 9.5V15.5C20 15.7761 20.2238 16 20.5 16H22.4999ZM15.5 16C15.7761 16 16 15.7761 16 15.5V9.5C16 9.22386 15.7761 9 15.5 9H13.5C13.2238 9 13 9.22386 13 9.5L13 15.5C13 15.7761 13.2238 16 13.5 16H15.5Z" fill="url(#paint0_linear_5214_83344)" fill-opacity="0.15"/>
                  <defs>
                    <linearGradient id="paint0_linear_5214_83344" x1="17.5" y1="4" x2="17.5" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stop-color="white" stop-opacity="0"/>
                      <stop offset="1" stop-color="white"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={valueStyles}>Bank transfer (DE12 ... 2871)</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={sectionStyles}>
              <div style={labelStyles}>Get paid to</div>
              <div style={bankTransferContainerStyles}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 36 24" fill="none">
                  <rect width="36" height="24" rx="4" fill="#DBEAFE"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M27.9999 6.4099C27.9999 6.17156 27.8317 5.96635 27.598 5.91961L18.0981 4.01961C18.0333 4.00667 17.9667 4.00667 17.9019 4.01961L8.40194 5.91961C8.16823 5.96635 8 6.17156 8 6.4099V8.5C8 8.77614 8.22386 9 8.5 9H9.49998C9.77612 9 9.99998 9.22386 9.99998 9.5V15.5C9.99998 15.7761 9.77612 16 9.49998 16H8.5C8.22386 16 8 16.2239 8 16.5V18.5C8 18.7761 8.22386 19 8.5 19H27.5C27.7761 19 28 18.7761 28 18.5V16.5C28 16.2239 27.7761 16 27.5 16H26.5C26.2238 16 26 15.7761 26 15.5V9.5C26 9.22386 26.2238 9 26.5 9H27.4999C27.7761 9 27.9999 8.77614 27.9999 8.5V6.4099ZM22.4999 16C22.7761 16 22.9999 15.7761 22.9999 15.5V9.5C22.9999 9.22386 22.7761 9 22.4999 9H20.5C20.2238 9 20 9.22386 20 9.5V15.5C20 15.7761 20.2238 16 20.5 16H22.4999ZM15.5 16C15.7761 16 16 15.7761 16 15.5V9.5C16 9.22386 15.7761 9 15.5 9H13.5C13.2238 9 13 9.22386 13 9.5L13 15.5C13 15.7761 13.2238 16 13.5 16H15.5Z" fill="#3B82F6"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M27.9999 6.4099C27.9999 6.17156 27.8317 5.96635 27.598 5.91961L18.0981 4.01961C18.0333 4.00667 17.9667 4.00667 17.9019 4.01961L8.40194 5.91961C8.16823 5.96635 8 6.17156 8 6.4099V8.5C8 8.77614 8.22386 9 8.5 9H9.49998C9.77612 9 9.99998 9.22386 9.99998 9.5V15.5C9.99998 15.7761 9.77612 16 9.49998 16H8.5C8.22386 16 8 16.2239 8 16.5V18.5C8 18.7761 8.22386 19 8.5 19H27.5C27.7761 19 28 18.7761 28 18.5V16.5C28 16.2239 27.7761 16 27.5 16H26.5C26.2238 16 26 15.7761 26 15.5V9.5C26 9.22386 26.2238 9 26.5 9H27.4999C27.7761 9 27.9999 8.77614 27.9999 8.5V6.4099ZM22.4999 16C22.7761 16 22.9999 15.7761 22.9999 15.5V9.5C22.9999 9.22386 22.7761 9 22.4999 9H20.5C20.2238 9 20 9.22386 20 9.5V15.5C20 15.7761 20.2238 16 20.5 16H22.4999ZM15.5 16C15.7761 16 16 15.7761 16 15.5V9.5C16 9.22386 15.7761 9 15.5 9H13.5C13.2238 9 13 9.22386 13 9.5L13 15.5C13 15.7761 13.2238 16 13.5 16H15.5Z" fill="url(#paint0_linear_5214_83344)" fill-opacity="0.15"/>
                  <defs>
                    <linearGradient id="paint0_linear_5214_83344" x1="17.5" y1="4" x2="17.5" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stop-color="white" stop-opacity="0"/>
                      <stop offset="1" stop-color="white"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={valueStyles}>Bank transfer (DE12 ... 2871)</div>
              </div>
            </div>
            <div style={dividerStyles} />
            <div style={sectionStyles}>
              <div style={labelStyles}>Sending from</div>
              <div style={addressContainerStyles}>
                {selectedAsset === 'BTC' ? (
                  <svg style={assetIconSmallStyles} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57 57" fill="none">
                    <path d="M55.6622 35.2733C51.9222 50.2735 36.7278 59.4023 21.7241 55.6617C6.72681 51.9221 -2.40301 36.7284 1.33865 21.7295C5.07704 6.72773 20.2715 -2.40175 35.2704 1.33786C50.273 5.07746 59.4022 20.2728 55.6618 35.2736L55.6621 35.2733H55.6622Z" fill="#F7931A"/>
                    <path d="M41.0305 24.6517C41.5839 20.9005 38.7671 18.884 34.9153 17.5389L36.1648 12.4575L33.114 11.6868L31.8976 16.6344C31.0956 16.4315 30.2719 16.2404 29.4533 16.051L30.6785 11.0707L27.6296 10.3L26.3794 15.3797C25.7157 15.2265 25.0638 15.0751 24.4314 14.9155L24.4349 14.8995L20.2278 13.8344L19.4162 17.1381C19.4162 17.1381 21.6797 17.6641 21.632 17.6965C22.8674 18.0091 23.0908 18.8383 23.0537 19.4955L21.6303 25.2844C21.7154 25.3063 21.8258 25.338 21.9475 25.3876C21.8457 25.362 21.7374 25.334 21.625 25.3067L19.63 33.4161C19.479 33.7967 19.0958 34.3678 18.232 34.1509C18.2626 34.1958 16.0147 33.5899 16.0147 33.5899L14.5 37.1306L18.4701 38.134C19.2087 38.3218 19.9325 38.5183 20.6452 38.7031L19.3828 43.8427L22.4301 44.6135L23.6803 39.5284C24.5128 39.7575 25.3207 39.9689 26.1116 40.1681L24.8656 45.2292L27.9165 46L29.1788 40.87C34.3811 41.8682 38.2928 41.4657 39.9393 36.6949C41.266 32.8538 39.8732 30.6383 37.1363 29.1935C39.1298 28.7274 40.6312 27.3981 41.0316 24.6521L41.0306 24.6514L41.0305 24.6517ZM34.0601 34.5618C33.1173 38.4029 26.7387 36.3265 24.6707 35.8058L26.346 28.9967C28.4139 29.5201 35.0455 30.5559 34.0603 34.5618H34.0601ZM35.0036 24.5961C34.1436 28.0899 28.8346 26.3149 27.1124 25.8796L28.6313 19.7041C30.3535 20.1394 35.8996 20.9517 35.0039 24.5961H35.0036Z" fill="white"/>
                  </svg>
                ) : selectedAsset === 'ETH' ? (
                  <svg style={assetIconSmallStyles} viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28.5" cy="28.5" r="28.5" fill="#627EEA"/>
                    <path d="M28.5 8v15.177l12.832 5.731L28.5 8Z" fill="#C0CBF6"/>
                    <path d="M28.5 8 15.667 28.908l12.833-5.731V8Z" fill="white"/>
                    <path d="M28.5 39.647v9.345l12.837-17.775L28.5 39.647Z" fill="#C0CBF6"/>
                    <path d="m28.5 48.992v-9.345l-12.833-8.43L28.5 48.992Z" fill="white"/>
                    <path d="m28.5 37.145 12.832-8.237-12.832-5.731v13.968Z" fill="#8197EE"/>
                    <path d="m15.667 28.908 12.833 8.237V23.177l-12.833 5.731Z" fill="#C0CBF6"/>
                  </svg>
                ) : (
                  <svg style={assetIconSmallStyles} viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28.5" cy="28.5" r="28.5" fill="#000000"/>
                    <path d="M19.319 35.353a.832.832 0 0 1 .587-.243h25.228a.416.416 0 0 1 .294.71l-5.166 5.166a.832.832 0 0 1-.587.243H14.447a.416.416 0 0 1-.294-.71l5.166-5.166Z" fill="url(#a)"/>
                    <path d="M19.319 16.243a.832.832 0 0 1 .587-.243h25.228a.416.416 0 0 1 .294.71l-5.166 5.166a.832.832 0 0 1-.587.243H14.447a.416.416 0 0 1-.294-.71l5.166-5.166Z" fill="url(#b)"/>
                    <path d="M39.675 25.743a.832.832 0 0 0-.587-.243H13.86a.416.416 0 0 0-.294.71l5.166 5.166a.832.832 0 0 0 .587.243h25.228a.416.416 0 0 0 .294-.71l-5.166-5.166Z" fill="url(#c)"/>
                    <defs>
                      <linearGradient id="a" x1="42.766" y1="14.657" x2="23.986" y2="48.491" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FFA3"/>
                        <stop offset="1" stopColor="#DC1FFF"/>
                      </linearGradient>
                      <linearGradient id="b" x1="42.766" y1="14.657" x2="23.986" y2="48.491" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FFA3"/>
                        <stop offset="1" stopColor="#DC1FFF"/>
                      </linearGradient>
                      <linearGradient id="c" x1="42.766" y1="14.657" x2="23.986" y2="48.491" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00FFA3"/>
                        <stop offset="1" stopColor="#DC1FFF"/>
                      </linearGradient>
                    </defs>
                  </svg>
                )}
                <div style={valueStyles}>{truncateAddress('0x4983fC1587476B2Fc8874E19e02D6bC085f9f075')}</div>
              </div>
            </div>
          </>
        )}
      </div>
      <div style={cardFooterStyles}>
        <div style={feesContainerStyles}>
          <div style={feesContainerRowStyles}>
            <div style={leftColumnStyles}>
              <div style={totalTextStyles}>{mode === 'buy' ? 'Total' : 'Total payout'}</div>
              <div style={feesTextContainerStyles} onClick={() => setIsFeesDrawerOpen(true)}>
                <div style={feesTextStyles}>Fees included</div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#1E1E1E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div style={fiatTextStyles} onClick={handleFiatClick}>{formatFiat(fiatValue)}</div>
          </div>
        </div>
        <button style={buttonStyles} onClick={handleContinue}>
          Continue with bank transfer
        </button>
        <div style={footerTextStyles}>
          Powered by
          <svg xmlns="http://www.w3.org/2000/svg" width="14.4" height="9.391" viewBox="0 0 38 26" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.0123 1.04628C13.2842 0.317906 12.1036 0.317907 11.3755 1.04628L0.743984 11.6811C0.0158393 12.4095 0.0158401 13.5904 0.743985 14.3188L11.3755 24.9536C12.1036 25.682 13.2842 25.682 14.0123 24.9536L18.6354 20.329L12.627 14.3187C11.8988 13.5903 11.8988 12.4094 12.627 11.681L18.6353 5.67077L14.0123 1.04628Z" fill="#00A754"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M25.8953 1.04628C25.1671 0.317906 23.9866 0.317907 23.2584 1.04628L18.6354 5.67075L24.6438 11.681C25.3719 12.4094 25.3719 13.5903 24.6438 14.3187L18.6354 20.329L23.2584 24.9536C23.9866 25.682 25.1671 25.682 25.8953 24.9536L36.5267 14.3188C37.2549 13.5904 37.2549 12.4095 36.5267 11.6811L25.8953 1.04628Z" fill="#0A6E5C"/>
          </svg>
          <span style={footerBoldTextStyles}>Ramp Network</span>
        </div>
      </div>
      <div style={{
        ...feesDrawerStyles,
        transform: `translateY(${isFeesDrawerOpen ? '0' : '100%'})`,
      }}>
        <div data-align="Center" style={{ width: '100%', height: '48px', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px', display: 'inline-flex', marginBottom: '4px' }}>
          <div style={{ flex: '1 1 0', alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', display: 'inline-flex' }}>
            <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'flex' }}>
              <div style={{ width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px', display: 'inline-flex' }}>
                <div style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '24px',
                  color: '#1E1E1E',
                  textAlign: 'left',
                  width: '100%'
                }}>
                  {mode === 'buy' ? 'Buying' : 'Selling'} <span style={{ fontWeight: 600 }}>{assetValue} {selectedAsset}</span> for <span style={{ fontWeight: 600 }}>{formatFiat(fiatValue)}</span>
                </div>
              </div>
              <div style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                color: '#6B7280',
                textAlign: 'left',
                paddingBottom: '8px'
              }}>
                1 {selectedAsset} = {formatFiat(getExactPrice())}
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div style={feesOptionStyles}>
            <div style={feesLabelStyles}>Processing fee</div>
            <div style={feesValueStyles}>{selectedCurrency === 'EUR' ? '€' : '$'}{calculateProcessingFee()}</div>
          </div>
          {mode === 'buy' && (
            <div style={feesOptionStyles}>
              <div style={feesLabelStyles}>Network fee</div>
              <div style={feesValueStyles}>{selectedCurrency === 'EUR' ? '€' : '$'}{calculateNetworkFee()}</div>
            </div>
          )}
          <div style={dividerStyles} />
          <div style={{
            ...feesOptionStyles,
            marginTop: '4px'
          }}>
            <div style={{
              ...feesLabelStyles,
              fontWeight: 500
            }}>Total fees</div>
            <div style={{
              ...feesValueStyles,
              fontWeight: 600
            }}>{selectedCurrency === 'EUR' ? '€' : '$'}{mode === 'buy' ? calculateTotalFees() : calculateProcessingFee()}</div>
          </div>
          <button 
            onClick={() => setIsFeesDrawerOpen(false)}
            style={{
              display: 'flex',
              width: '100%',
              minHeight: '48px',
              maxHeight: '48px',
              padding: '12px 16px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '8px',
              background: '#FFFFFF',
              color: '#1E1E1E',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              marginTop: '16px',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            Close
          </button>
        </div>
      </div>
      <div style={{
        ...drawerStyles,
        transform: `translateY(${isDrawerOpen ? '0' : '100%'})`,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }}>
        <div data-align="Center" style={{ width: '100%', height: '48px', justifyContent: 'center', alignItems: 'flex-start', gap: '4px', display: 'inline-flex' }}>
          <div style={{ justifyContent: 'center', alignItems: 'flex-start', gap: '8px', display: 'flex' }}>
            <div data-content="Button" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <div style={{ minWidth: '48px', maxHeight: '48px', minHeight: '48px' }}></div>
            </div>
          </div>
          <div style={{ flex: '1 1 0', alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
            <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }}>
              <div style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'inline-flex' }}>
                <div style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '24px',
                  letterSpacing: '-0.09px',
                  color: '#1E1E1E',
                  textAlign: 'center',
                  width: '100%'
                }}>Currency</div>
              </div>
            </div>
          </div>
          <div style={{ justifyContent: 'center', alignItems: 'flex-start', gap: '8px', display: 'flex' }}>
            <div data-content="Button" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <div 
                onClick={() => setIsDrawerOpen(false)}
                style={closeButtonStyles}
              >
                <div style={{ width: '24px', height: '24px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
                  <div style={{ width: '20px', height: '20px', position: 'relative', overflow: 'hidden' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 5L5 15M5 5L15 15" stroke="#1E1E1E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ 
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '20px',
          letterSpacing: '-0.09px',
          color: '#1E1E1E',
          textAlign: 'left',
          width: '100%'
        }}>
          Available currencies (2)
        </div>
        <div style={{ width: '100%' }}>
          <div 
            style={currencyOptionStyles}
            onClick={() => handleCurrencyClick('EUR')}
          >
            <div style={currencyContentStyles}>
              <div style={currencyTextStyles}>
                <div style={currencyTitleStyles}>EUR</div>
                <div style={currencySubtitleStyles}>Euro</div>
              </div>
            </div>
            {selectedCurrency === 'EUR' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.9165 10.3613L7.68924 15.4168L17.0832 4.5835" stroke="#16A34A" strokeWidth="1.25" strokeLinecap="square"/>
              </svg>
            )}
          </div>
          <div style={dividerStyles} />
          <div 
            style={currencyOptionStyles}
            onClick={() => handleCurrencyClick('USD')}
          >
            <div style={currencyContentStyles}>
              <div style={currencyTextStyles}>
                <div style={currencyTitleStyles}>USD</div>
                <div style={currencySubtitleStyles}>US Dollar</div>
              </div>
            </div>
            {selectedCurrency === 'USD' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.9165 10.3613L7.68924 15.4168L17.0832 4.5835" stroke="#16A34A" strokeWidth="1.25" strokeLinecap="square"/>
              </svg>
            )}
          </div>
        </div>
      </div>
      <div 
        style={overlayStyles}
        onClick={() => {
          setIsDrawerOpen(false);
          setIsFeesDrawerOpen(false);
        }}
      />
    </div>
  );
};

export default Checkout; 