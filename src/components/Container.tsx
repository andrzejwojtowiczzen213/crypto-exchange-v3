import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ContainerProps {
  children?: React.ReactNode;
}

interface LocationState {
  selectedAsset?: string;
  assetValue?: string;
  mode?: 'buy' | 'sell';
  selectedCurrency?: 'EUR' | 'USD';
  fiatValue?: string;
  focusField?: 'fiat' | 'asset';
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as LocationState | null;

  // Constants
  const btcRate = 84426.20;
  const ethRate = 1940.21;
  const solRate = 148.32;
  const usdRate = 1.088; // EUR to USD exchange rate
  const defaultCurrency = (navigationState?.selectedCurrency || 'USD') as 'USD' | 'EUR';

  // Refs
  const [fiatInputRef] = useState<React.RefObject<HTMLInputElement>>(React.createRef());
  const [assetInputRef] = useState<React.RefObject<HTMLInputElement>>(React.createRef());

  // State declarations
  const [selectedAsset, setSelectedAsset] = useState(navigationState?.selectedAsset || 'BTC');
  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'USD'>(defaultCurrency);
  const [mode, setMode] = useState<'buy' | 'sell'>(navigationState?.mode || 'buy');
  const [showTokenOnTop, setShowTokenOnTop] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFeesDrawerOpen, setIsFeesDrawerOpen] = useState(false);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);

  // Helper functions
  const formatFiat = (value: string) => {
    const numericValue = parseFloat(value.replace(/[€$,]/g, ''));
    if (isNaN(numericValue)) return selectedCurrency === 'EUR' ? '€0' : '$0';
    const symbol = selectedCurrency === 'EUR' ? '€' : '$';
    
    const hasDecimals = value.includes('.');
    if (!hasDecimals) {
      return `${symbol}${numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    } else {
      const parts = value.split('.');
      const decimalPlaces = parts.length === 2 ? Math.min(parts[1].length, 2) : 0;
      return `${symbol}${numericValue.toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}`;
    }
  };

  const getAssetRate = () => {
    let rate;
    switch (selectedAsset) {
      case 'ETH':
        rate = ethRate;
        break;
      case 'SOL':
        rate = solRate;
        break;
      default:
        rate = btcRate;
    }
    return selectedCurrency === 'USD' ? rate * usdRate : rate;
  };

  // Dependent state declarations
  const [assetValue, setAssetValue] = useState(() => {
    if (navigationState?.assetValue) return navigationState.assetValue;
    const rate = btcRate;
    return (500 / rate).toFixed(4);
  });

  const [inputValue, setInputValue] = useState(() => {
    if (navigationState?.fiatValue) return navigationState.fiatValue;
    return formatFiat('500');
  });

  useEffect(() => {
    if (!location.state) {
      const rate = getAssetRate();
      const defaultAssetValue = (500 / rate).toFixed(4);
      setAssetValue(defaultAssetValue);
    }
  }, []);

  useEffect(() => {
    if (navigationState?.assetValue) {
      setAssetValue(navigationState.assetValue);
      setSelectedAsset(navigationState.selectedAsset || 'BTC');
      const assetRate = getAssetRate();
      const numericValue = parseFloat(navigationState.assetValue);
      if (!isNaN(numericValue)) {
        const fiatValue = numericValue * assetRate;
        setInputValue(`${selectedCurrency === 'EUR' ? '€' : '$'}${Math.round(fiatValue).toLocaleString()}`);
      }
    }
  }, []);

  useEffect(() => {
    if (navigationState?.focusField === 'fiat') {
      setShowTokenOnTop(false); // Ensure fiat input is on top
      setTimeout(() => fiatInputRef.current?.focus(), 0);
    } else if (navigationState?.focusField === 'asset') {
      setShowTokenOnTop(true); // Ensure asset input is on top
      setTimeout(() => assetInputRef.current?.focus(), 0);
    }
  }, [navigationState?.focusField]);

  useEffect(() => {
    const shouldShowTokenOnTop = mode === 'sell';
    setShowTokenOnTop(shouldShowTokenOnTop);
    
    if (shouldShowTokenOnTop) {
      // Switching to sell mode - show token input on top
      const numericValue = parseFloat(assetValue);
      if (!isNaN(numericValue)) {
        setAssetValue(numericValue.toFixed(4));
        const rate = getAssetRate();
        const fiatValue = numericValue * rate;
        setInputValue(formatFiat(fiatValue.toString()));
      }
    } else {
      // Switching to buy mode - show fiat input on top
      const fiatValue = inputValue.replace(/[€$,]/g, '');
      const numericValue = parseFloat(fiatValue);
      if (!isNaN(numericValue)) {
        setInputValue(formatFiat(numericValue.toString()));
        const rate = getAssetRate();
        const baseValue = selectedCurrency === 'USD' ? numericValue / usdRate : numericValue;
        const assetAmount = baseValue / (rate / (selectedCurrency === 'USD' ? usdRate : 1));
        setAssetValue(assetAmount.toFixed(4));
      }
    }
  }, [mode]);

  useEffect(() => {
    if (location.state) {
      const { selectedAsset: stateAsset, assetValue: stateAssetValue, mode: stateMode, selectedCurrency: stateCurrency, fiatValue: stateFiatValue, focusField } = location.state as LocationState;
      
      if (stateAsset) setSelectedAsset(stateAsset);
      if (stateMode) setMode(stateMode);
      if (stateCurrency) setSelectedCurrency(stateCurrency);
      
      // Set values based on which field had focus
      if (focusField === 'asset') {
        setShowTokenOnTop(true);
        if (stateAssetValue) setAssetValue(stateAssetValue);
        if (stateFiatValue) setInputValue(stateFiatValue);
      } else {
        setShowTokenOnTop(false);
        if (stateAssetValue) setAssetValue(stateAssetValue);
        if (stateFiatValue) setInputValue(stateFiatValue);
      }
    }
  }, [location.state]);

  // Add effect to handle currency changes
  useEffect(() => {
    const numericValue = parseFloat(inputValue.replace(/[€$,]/g, ''));
    if (!isNaN(numericValue)) {
      setInputValue(formatFiat(numericValue.toString()));
    }
  }, [selectedCurrency]);

  // Add effect to handle asset and currency changes
  useEffect(() => {
    const rate = getAssetRate();
    if (showTokenOnTop) {
      // If asset input is on top, update fiat value
      const numericAssetValue = parseFloat(assetValue);
      if (!isNaN(numericAssetValue)) {
        const fiatValue = numericAssetValue * rate;
        setInputValue(formatFiat(fiatValue.toString()));
      }
    } else {
      // If fiat input is on top, update asset value
      const numericFiatValue = parseFloat(inputValue.replace(/[€$,]/g, ''));
      if (!isNaN(numericFiatValue)) {
        const baseValue = selectedCurrency === 'USD' ? numericFiatValue / usdRate : numericFiatValue;
        const assetAmount = baseValue / (rate / (selectedCurrency === 'USD' ? usdRate : 1));
        setAssetValue(assetAmount.toFixed(4));
      }
    }
  }, [selectedAsset, selectedCurrency]);

  const handleToggle = () => {
    setShowTokenOnTop(!showTokenOnTop);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isAssetInput: boolean) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    if (isAssetInput) {
      // If asset input is being changed, update asset value and calculate fiat value
      setAssetValue(numericValue);
      const rate = getAssetRate();
      const newFiatValue = (parseFloat(numericValue) * rate).toFixed(2);
      setInputValue(formatFiat(newFiatValue));
    } else {
      // If fiat input is being changed, update fiat value and calculate asset value
      setInputValue(formatFiat(numericValue));
      const rate = getAssetRate();
      const baseValue = selectedCurrency === 'USD' ? parseFloat(numericValue) / usdRate : parseFloat(numericValue);
      const newAssetValue = (baseValue / (rate / (selectedCurrency === 'USD' ? usdRate : 1))).toFixed(4);
      setAssetValue(newAssetValue);
    }
  };

  const buttonStyles = {
    display: 'flex',
    padding: '6px 8px',
    alignItems: 'center',
    gap: '4px',
    borderRadius: '640px',
    border: '1px solid #D2D9E5',
    background: '#FFF',
    boxShadow: '0px 2px 4px 0px rgba(30, 30, 30, 0.04)',
    cursor: 'pointer',
    justifyContent: 'space-between',
  };

  const buttonContentStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const buttonTextStyles = {
    overflow: 'hidden',
    color: 'var(--colors-base-secondary-foreground, #1E1E1E)',
    textOverflow: 'ellipsis',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: 'var(--layout-font-size-text-medium, 16px)',
    fontStyle: 'normal',
    fontWeight: 'var(--font-weight-bold, 700)',
    lineHeight: 'var(--layout-line-height-leading-medium, 24px)',
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
    width: '100%',
    justifyContent: 'flex-start',
  };

  const currencyTextStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    alignItems: 'flex-start',
    width: '100%',
  };

  const currencyTitleStyles = {
    color: '#1E1E1E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    textAlign: 'left' as const,
  };

  const currencySubtitleStyles = {
    color: '#6B7280',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    textAlign: 'left' as const,
  };

  const dividerStyles = {
    width: '100%',
    height: '1px',
    backgroundColor: '#F3F4F6',
    margin: '0',
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
    cursor: 'pointer'
  };

  const feesLabelStyles = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    color: '#1E1E1E',
    cursor: 'pointer'
  };

  const feesValueStyles = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    color: '#1E1E1E',
    cursor: 'pointer'
  };

  const calculateNetworkFee = () => {
    const numericValue = showTokenOnTop ? 
      parseFloat(assetValue) * getAssetRate() : 
      parseFloat(inputValue.replace(/[€$,]/g, ''));

    if (isNaN(numericValue)) return '0.00';
    
    const networkFeeRate = 0.001; // 0.1% for all assets
    const networkFee = numericValue * networkFeeRate;
    return networkFee.toFixed(2);
  };

  const calculateProcessingFee = () => {
    const numericValue = showTokenOnTop ? 
      parseFloat(assetValue) * getAssetRate() : 
      parseFloat(inputValue.replace(/[€$,]/g, ''));

    if (isNaN(numericValue)) return '0.00';
    
    const processingFeeRate = 0.005; // 0.5% for all assets
    const processingFee = numericValue * processingFeeRate;
    return processingFee.toFixed(2);
  };

  const overlayStyles: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 2,
    opacity: isDrawerOpen || isFeesDrawerOpen || isAssetDrawerOpen ? 1 : 0,
    visibility: isDrawerOpen || isFeesDrawerOpen || isAssetDrawerOpen ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
  };

  const drawerHeaderStyles = {
    width: '100%',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px',
  };

  const closeButtonStyles = {
    minWidth: '48px',
    maxHeight: '48px',
    minHeight: '48px',
    padding: '4px',
    background: 'rgba(245, 247, 250, 0.01)',
    overflow: 'hidden',
    borderRadius: '640px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer',
  };

  const closeIconStyles = {
    width: '12.08px',
    height: '12.08px',
    position: 'absolute' as const,
    outline: '1.25px #1E1E1E solid',
    outlineOffset: '-0.62px',
  };

  const drawerTextStyles: CSSProperties = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
    WebkitLineClamp: 1,
    flex: '1 0 0',
    overflow: 'hidden',
    color: '#1E1E1E',
    textOverflow: 'ellipsis',
    fontFamily: 'var(--layout-font-family-primary, Inter)',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 'var(--font-weight-medium, 500)',
    lineHeight: '20px',
    letterSpacing: '-0.09px',
  };

  const handleCurrencyClick = (currency: 'EUR' | 'USD') => {
    if (currency === 'EUR' || currency === 'USD') {
      setSelectedCurrency(currency);
      // Calculate new fiat value based on current asset value
      const rate = getAssetRate();
      const numericAssetValue = parseFloat(assetValue);
      if (!isNaN(numericAssetValue)) {
        const fiatValue = numericAssetValue * rate;
        setInputValue(formatFiat(fiatValue.toString()));
      }
      setIsDrawerOpen(false);
    }
  };

  const handleAssetClick = (asset: string) => {
    if (asset !== selectedAsset) {
      setSelectedAsset(asset);
    }
    setIsAssetDrawerOpen(false);
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
    alignItems: 'center',
    gap: '8px',
  };

  const textStyles = {
    overflow: 'hidden',
    color: '#1E1E1E',
    textAlign: 'center' as const,
    textOverflow: 'ellipsis',
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    fontSize: '58px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '72px',
    letterSpacing: '-1.2px',
    padding: '0 20px',
    border: 'none',
    background: 'none',
    width: '100%',
    outline: 'none',
  };

  const secondTextWrapperStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0 20px',
    cursor: 'pointer',
  };

  const secondTextStyles = {
    color: '#6B7280',
    textAlign: 'center' as const,
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '24px',
  };

  const navBarStyles = {
    width: '100%',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 0 16px',
    background: '#FFFFFF',
    marginBottom: '16px',
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

  const iconContainerStyles = {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const userIconStyles = {
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardFooterStyles = {
    width: '100%',
    padding: '16px',
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  };

  const feesTextContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#1E1E1E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '16px',
    width: '100%',
    justifyContent: 'space-between',
  };

  const feesAndRateContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '24px 16px 12px',
    background: '#F5F7FA',
    borderRadius: '0 0 12px 12px',
    marginTop: '-12px',
    position: 'relative' as const,
    zIndex: 0,
  };

  const feesClickContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    color: '#6B7280'  // Changed from '#1E1E1E' to '#6B7280' for grey color
  };

  const totalTextStyles = {
    color: '#1E1E1E',
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    fontSize: '16px',
    fontWeight: 500,
  };

  const feesTextStyles = {
    color: '#1E1E1E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
  };

  const exchangeRateStyles = {
    color: '#6B7280',
    fontSize: '14px',
  };

  const footerButtonStyles = {
    display: 'flex',
    width: '361px',
    minHeight: '48px',
    maxHeight: '48px',
    padding: '12px 16px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '8px',
    background: '#049147',  // Changed back from #FF0000 to #049147
    color: '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  };

  const poweredByStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: 'rgba(30, 30, 30, 1)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '16px',
  };

  const poweredByBrandStyles = {
    fontWeight: 500,
  };

  const cardBodyStyles = {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '0px',  // Changed from '16px' to '0px'
    padding: '0 16px',
    marginTop: '24px',
  };

  const segmentedControlStyles = {
    display: 'flex',
    alignItems: 'center',
    background: '#F3F4F6',
    borderRadius: '8px',
    padding: '2px',
    gap: '2px',
    width: '164px',
    height: '40px',
  };

  const segmentButtonStyles = (isActive: boolean) => ({
    flex: 1,
    height: '36px',
    padding: '6px 16px',
    background: isActive ? '#FFFFFF' : 'transparent',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    color: isActive ? '#1E1E1E' : '#6B7280',
    transition: 'all 0.2s ease',
    boxShadow: isActive ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
  });

  const handleContinue = () => {
    navigate('/checkout', { 
      state: { 
        selectedAsset,
        assetValue: showTokenOnTop ? assetValue : assetValue,
        mode,
        selectedCurrency,
        fiatValue: showTokenOnTop ? inputValue : inputValue,
        focusField: showTokenOnTop ? 'asset' : 'fiat'
      } 
    });
  };

  const walletAndPaymentContainerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '-1px',
    alignSelf: 'stretch',
    boxShadow: '0px 2px 4px 0px rgba(30, 30, 30, 0.04)',
    margin: '0 12px',
  };

  const sectionStyles = {
    display: 'flex',
    padding: '12px',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '8px',
    alignSelf: 'stretch',
    background: '#FFFFFF',
    borderRadius: '12px',
    width: '100%',
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
    fontWeight: 600,
    lineHeight: '24px',
  };

  const assetTitleStyles = {
    color: '#1E1E1E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    textAlign: 'left',
  };

  const assetSubtitleStyles = {
    color: '#6B7280',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    textAlign: 'left',
  };

  const inputContainerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    gap: '0px',
    alignSelf: 'stretch',
    margin: '0',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    background: '#FFFFFF',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    position: 'relative' as const,
    zIndex: 1,
  };

  const inputSectionStyles = {
    display: 'flex',
    padding: '16px 10px 16px 16px',  // Changed right padding from 16px to 10px
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    alignSelf: 'stretch',
    width: '100%',
  };

  const inputGroupStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0px',
    flex: 1,
  };

  const inputLabelStyles = {
    color: '#6B7280',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
  };

  const inputStyles = {
    color: '#1E1E1E',
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    fontSize: '32px',  // Changed from '24px' to '32px'
    fontWeight: 700,
    lineHeight: '32px',
    border: 'none',
    background: 'none',
    outline: 'none',
    width: '100%',
    padding: '0',
  };

  const selectionButtonStyles = {
    display: 'flex',
    padding: '6px 2px 6px 6px',  // Reduced right and left padding
    alignItems: 'center',
    gap: '2px',  // Reduced gap between elements
    borderRadius: '640px',
    border: 'none',
    background: '#FFF',
    cursor: 'pointer',
    minWidth: '90px',  // Reduced minimum width
    justifyContent: 'space-between',
  };

  const mainInputStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };

  const assetSymbolStyles = {
    color: '#1E1E1E',
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    fontSize: '58px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '72px',
    letterSpacing: '-1.2px',
    marginLeft: '8px',
  };

  const secondaryDisplayStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#6B7280',
    fontFamily: '"Satoshi Variable", system-ui, sans-serif',
    fontSize: '22px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '24px',
    cursor: 'pointer',
    width: '100%',
  };

  const toggleIconStyles = {
    transition: 'transform 0.3s ease',
    transform: showTokenOnTop ? 'rotate(180deg)' : 'none',
  };

  const drawerTitleContainerStyles = {
    width: '100%',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  };

  const drawerTitleStyles = {
    color: '#1E1E1E',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    textAlign: 'center' as const,
  };

  const closeButtonContainerStyles = {
    position: 'absolute' as const,
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  };

  const feesDrawerStyles: CSSProperties = {
    ...drawerStyles,
    gap: '4px',
  };

  const calculateTotalFees = () => {
    const processingFee = parseFloat(calculateProcessingFee());
    const networkFee = parseFloat(calculateNetworkFee());
    return (processingFee + networkFee).toFixed(2);
  };

  const buttonIconStyles = {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyles}>
      <div style={navBarStyles}>
        <div style={iconContainerStyles}>
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="26" viewBox="0 0 38 26" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.0123 1.04628C13.2842 0.317906 12.1036 0.317907 11.3755 1.04628L0.743984 11.6811C0.0158393 12.4095 0.0158401 13.5904 0.743985 14.3188L11.3755 24.9536C12.1036 25.682 13.2842 25.682 14.0123 24.9536L18.6354 20.329L12.627 14.3187C11.8988 13.5903 11.8988 12.4094 12.627 11.681L18.6353 5.67077L14.0123 1.04628Z" fill="#00A754"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M25.8953 1.04628C25.1671 0.317906 23.9866 0.317907 23.2584 1.04628L18.6354 5.67075L24.6438 11.681C25.3719 12.4094 25.3719 13.5903 24.6438 14.3187L18.6354 20.329L23.2584 24.9536C23.9866 25.682 25.1671 25.682 25.8953 24.9536L36.5267 14.3188C37.2549 13.5904 37.2549 12.4095 36.5267 11.6811L25.8953 1.04628Z" fill="#0A6E5C"/>
          </svg>
        </div>
        <div style={segmentedControlStyles}>
          <button 
            style={segmentButtonStyles(mode === 'buy')}
            onClick={() => setMode('buy')}
          >
            Buy
          </button>
          <button 
            style={segmentButtonStyles(mode === 'sell')}
            onClick={() => setMode('sell')}
          >
            Sell
          </button>
        </div>
        <div style={iconContainerStyles}>
          <div style={userIconStyles}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <g clipPath="url(#clip0_440_5125)">
                <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#ABBBCE"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 21.0602C19.461 21.0602 22.2667 18.256 22.2667 14.7968C22.2667 11.3376 19.461 8.53333 16 8.53333C12.539 8.53333 9.73334 11.3376 9.73334 14.7968C9.73334 18.256 12.539 21.0602 16 21.0602ZM16 41.4165C22.922 41.4165 28.5333 37.2101 28.5333 32.0213C28.5333 26.8325 22.922 22.6261 16 22.6261C9.07804 22.6261 3.46667 26.8325 3.46667 32.0213C3.46667 37.2101 9.07804 41.4165 16 41.4165Z" fill="white"/>
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
      <div style={cardBodyStyles}>
        <div style={inputContainerStyles}>
          {mode === 'buy' ? (
            <>
              <div style={inputSectionStyles}>
                <div style={inputGroupStyles}>
                  <div style={inputLabelStyles}>
                    You pay
                  </div>
                  <input
                    type="text"
                    value={inputValue.replace(/[€$]/g, '')}
                    onChange={(e) => handleInputChange(e, false)}
                    style={inputStyles}
                    placeholder="0"
                  />
                </div>
                <button 
                  style={selectionButtonStyles}
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <div style={buttonContentStyles}>
                    <div style={buttonIconStyles}>
                      {selectedCurrency === 'EUR' ? (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
                          <path d="M55.6622 35.2733C51.9222 50.2735 36.7278 59.4023 21.7241 55.6617C6.72681 51.9221 -2.40301 36.7284 1.33865 21.7295C5.07704 6.72773 20.2715 -2.40175 35.2704 1.33786C50.273 5.07746 59.4022 20.2728 55.6618 35.2736L55.6621 35.2733H55.6622Z" fill="#003399"/>
                          <path d="M28.5 11L29.3247 13.7123H32.1962L29.9357 15.3754L30.7604 18.0877L28.5 16.4246L26.2396 18.0877L27.0643 15.3754L24.8038 13.7123H27.6753L28.5 11Z" fill="#FFDA44"/>
                          <path d="M40.5 15L41.3247 17.7123H44.1962L41.9357 19.3754L42.7604 22.0877L40.5 20.4246L38.2396 22.0877L39.0643 19.3754L36.8038 17.7123H39.6753L40.5 15Z" fill="#FFDA44"/>
                          <path d="M45 26.5L45.8247 29.2123H48.6962L46.4357 30.8754L47.2604 33.5877L45 31.9246L42.7396 33.5877L43.5643 30.8754L41.3038 29.2123H44.1753L45 26.5Z" fill="#FFDA44"/>
                          <path d="M40.5 38L41.3247 40.7123H44.1962L41.9357 42.3754L42.7604 45.0877L40.5 43.4246L38.2396 45.0877L39.0643 42.3754L36.8038 40.7123H39.6753L40.5 38Z" fill="#FFDA44"/>
                          <path d="M28.5 42L29.3247 44.7123H32.1962L29.9357 46.3754L30.7604 49.0877L28.5 47.4246L26.2396 49.0877L27.0643 46.3754L24.8038 44.7123H27.6753L28.5 42Z" fill="#FFDA44"/>
                          <path d="M16.5 38L17.3247 40.7123H20.1962L17.9357 42.3754L18.7604 45.0877L16.5 43.4246L14.2396 45.0877L15.0643 42.3754L12.8038 40.7123H15.6753L16.5 38Z" fill="#FFDA44"/>
                          <path d="M12 26.5L12.8247 29.2123H15.6962L13.4357 30.8754L14.2604 33.5877L12 31.9246L9.7396 33.5877L10.5643 30.8754L8.3038 29.2123H11.1753L12 26.5Z" fill="#FFDA44"/>
                          <path d="M16.5 15L17.3247 17.7123H20.1962L17.9357 19.3754L18.7604 22.0877L16.5 20.4246L14.2396 22.0877L15.0643 19.3754L12.8038 17.7123H15.6753L16.5 15Z" fill="#FFDA44"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
                          <circle cx="28.5" cy="28.5" r="28.5" fill="white"/>
                          <g clipPath="url(#circle-mask)">
                            <rect x="-10" y="6.65" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="17.29" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="27.93" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="38.57" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="49.21" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="11.97" width="77" height="5.32" fill="white"/>
                            <rect x="-10" y="22.61" width="77" height="5.32" fill="white"/>
                            <rect x="-10" y="33.25" width="77" height="5.32" fill="white"/>
                            <rect x="-10" y="43.89" width="77" height="5.32" fill="white"/>
                            <rect x="-10" y="-4" width="35" height="35" fill="#2E3560"/>
                          </g>
                        </svg>
                      )}
                    </div>
                    {selectedCurrency}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#1E1E1E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div style={dividerStyles} />
              <div style={inputSectionStyles}>
                <div style={inputGroupStyles}>
                  <div style={inputLabelStyles}>
                    You receive
                  </div>
                  <input
                    type="text"
                    value={assetValue}
                    onChange={(e) => handleInputChange(e, true)}
                    style={inputStyles}
                    placeholder="0"
                  />
                </div>
                <button 
                  style={selectionButtonStyles}
                  onClick={() => setIsAssetDrawerOpen(true)}
                >
                  <div style={buttonContentStyles}>
                    <div style={buttonIconStyles}>
                      {selectedAsset === 'BTC' ? (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
                          <path d="M55.6622 35.2733C51.9222 50.2735 36.7278 59.4023 21.7241 55.6617C6.72681 51.9221 -2.40301 36.7284 1.33865 21.7295C5.07704 6.72773 20.2715 -2.40175 35.2704 1.33786C50.273 5.07746 59.4022 20.2728 55.6618 35.2736L55.6621 35.2733H55.6622Z" fill="#F7931A"/>
                          <path d="M41.0305 24.6517C41.5839 20.9005 38.7671 18.884 34.9153 17.5389L36.1648 12.4575L33.114 11.6868L31.8976 16.6344C31.0956 16.4315 30.2719 16.2404 29.4533 16.051L30.6785 11.0707L27.6296 10.3L26.3794 15.3797C25.7157 15.2265 25.0638 15.0751 24.4314 14.9155L24.4349 14.8995L20.2278 13.8344L19.4162 17.1381C19.4162 17.1381 21.6797 17.6641 21.632 17.6965C22.8674 18.0091 23.0908 18.8383 23.0537 19.4955L21.6303 25.2844C21.7154 25.3063 21.8258 25.338 21.9475 25.3876C21.8457 25.362 21.7374 25.334 21.625 25.3067L19.63 33.4161C19.479 33.7967 19.0958 34.3678 18.232 34.1509C18.2626 34.1958 16.0147 33.5899 16.0147 33.5899L14.5 37.1306L18.4701 38.134C19.2087 38.3218 19.9325 38.5183 20.6452 38.7031L19.3828 43.8427L22.4301 44.6135L23.6803 39.5284C24.5128 39.7575 25.3207 39.9689 26.1116 40.1681L24.8656 45.2292L27.9165 46L29.1788 40.87C34.3811 41.8682 38.2928 41.4657 39.9393 36.6949C41.266 32.8538 39.8732 30.6383 37.1363 29.1935C39.1298 28.7274 40.6312 27.3981 41.0316 24.6521L41.0306 24.6514L41.0305 24.6517ZM34.0601 34.5618C33.1173 38.4029 26.7387 36.3265 24.6707 35.8058L26.346 28.9967C28.4139 29.5201 35.0455 30.5559 34.0603 34.5618H34.0601ZM35.0036 24.5961C34.1436 28.0899 28.8346 26.3149 27.1124 25.8796L28.6313 19.7041C30.3535 20.1394 35.8996 20.9517 35.0039 24.5961H35.0036Z" fill="white"/>
                        </svg>
                      ) : selectedAsset === 'ETH' ? (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
                          <circle cx="28.5" cy="28.5" r="28.5" fill="#627EEA"/>
                          <path d="M28.5 8v15.177l12.832 5.731L28.5 8Z" fill="#C0CBF6"/>
                          <path d="M28.5 8 15.667 28.908l12.833-5.731V8Z" fill="white"/>
                          <path d="M28.5 39.647v9.345l12.837-17.775L28.5 39.647Z" fill="#C0CBF6"/>
                          <path d="m28.5 48.992v-9.345l-12.833-8.43L28.5 48.992Z" fill="white"/>
                          <path d="m28.5 37.145 12.832-8.237-12.832-5.731v13.968Z" fill="#8197EE"/>
                          <path d="m15.667 28.908 12.833 8.237V23.177l-12.833 5.731Z" fill="#C0CBF6"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
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
                    {selectedAsset}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#1E1E1E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={inputSectionStyles}>
                <div style={inputGroupStyles}>
                  <div style={inputLabelStyles}>
                    You sell
                  </div>
                  <input
                    type="text"
                    value={assetValue}
                    onChange={(e) => handleInputChange(e, true)}
                    style={inputStyles}
                    placeholder="0"
                  />
                </div>
                <button 
                  style={selectionButtonStyles}
                  onClick={() => setIsAssetDrawerOpen(true)}
                >
                  <div style={buttonContentStyles}>
                    <div style={buttonIconStyles}>
                      {selectedAsset === 'BTC' ? (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
                          <path d="M55.6622 35.2733C51.9222 50.2735 36.7278 59.4023 21.7241 55.6617C6.72681 51.9221 -2.40301 36.7284 1.33865 21.7295C5.07704 6.72773 20.2715 -2.40175 35.2704 1.33786C50.273 5.07746 59.4022 20.2728 55.6618 35.2736L55.6621 35.2733H55.6622Z" fill="#F7931A"/>
                          <path d="M41.0305 24.6517C41.5839 20.9005 38.7671 18.884 34.9153 17.5389L36.1648 12.4575L33.114 11.6868L31.8976 16.6344C31.0956 16.4315 30.2719 16.2404 29.4533 16.051L30.6785 11.0707L27.6296 10.3L26.3794 15.3797C25.7157 15.2265 25.0638 15.0751 24.4314 14.9155L24.4349 14.8995L20.2278 13.8344L19.4162 17.1381C19.4162 17.1381 21.6797 17.6641 21.632 17.6965C22.8674 18.0091 23.0908 18.8383 23.0537 19.4955L21.6303 25.2844C21.7154 25.3063 21.8258 25.338 21.9475 25.3876C21.8457 25.362 21.7374 25.334 21.625 25.3067L19.63 33.4161C19.479 33.7967 19.0958 34.3678 18.232 34.1509C18.2626 34.1958 16.0147 33.5899 16.0147 33.5899L14.5 37.1306L18.4701 38.134C19.2087 38.3218 19.9325 38.5183 20.6452 38.7031L19.3828 43.8427L22.4301 44.6135L23.6803 39.5284C24.5128 39.7575 25.3207 39.9689 26.1116 40.1681L24.8656 45.2292L27.9165 46L29.1788 40.87C34.3811 41.8682 38.2928 41.4657 39.9393 36.6949C41.266 32.8538 39.8732 30.6383 37.1363 29.1935C39.1298 28.7274 40.6312 27.3981 41.0316 24.6521L41.0306 24.6514L41.0305 24.6517ZM34.0601 34.5618C33.1173 38.4029 26.7387 36.3265 24.6707 35.8058L26.346 28.9967C28.4139 29.5201 35.0455 30.5559 34.0603 34.5618H34.0601ZM35.0036 24.5961C34.1436 28.0899 28.8346 26.3149 27.1124 25.8796L28.6313 19.7041C30.3535 20.1394 35.8996 20.9517 35.0039 24.5961H35.0036Z" fill="white"/>
                        </svg>
                      ) : selectedAsset === 'ETH' ? (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
                          <circle cx="28.5" cy="28.5" r="28.5" fill="#627EEA"/>
                          <path d="M28.5 8v15.177l12.832 5.731L28.5 8Z" fill="#C0CBF6"/>
                          <path d="M28.5 8 15.667 28.908l12.833-5.731V8Z" fill="white"/>
                          <path d="M28.5 39.647v9.345l12.837-17.775L28.5 39.647Z" fill="#C0CBF6"/>
                          <path d="m28.5 48.992v-9.345l-12.833-8.43L28.5 48.992Z" fill="white"/>
                          <path d="m28.5 37.145 12.832-8.237-12.832-5.731v13.968Z" fill="#8197EE"/>
                          <path d="m15.667 28.908 12.833 8.237V23.177l-12.833 5.731Z" fill="#C0CBF6"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
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
                    {selectedAsset}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#1E1E1E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div style={dividerStyles} />
              <div style={inputSectionStyles}>
                <div style={inputGroupStyles}>
                  <div style={inputLabelStyles}>
                    You receive
                  </div>
                  <input
                    type="text"
                    value={inputValue.replace(/[€$]/g, '')}
                    onChange={(e) => handleInputChange(e, false)}
                    style={inputStyles}
                    placeholder="0"
                  />
                </div>
                <button 
                  style={selectionButtonStyles}
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <div style={buttonContentStyles}>
                    <div style={buttonIconStyles}>
                      {selectedCurrency === 'EUR' ? (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
                          <path d="M55.6622 35.2733C51.9222 50.2735 36.7278 59.4023 21.7241 55.6617C6.72681 51.9221 -2.40301 36.7284 1.33865 21.7295C5.07704 6.72773 20.2715 -2.40175 35.2704 1.33786C50.273 5.07746 59.4022 20.2728 55.6618 35.2736L55.6621 35.2733H55.6622Z" fill="#003399"/>
                          <path d="M28.5 11L29.3247 13.7123H32.1962L29.9357 15.3754L30.7604 18.0877L28.5 16.4246L26.2396 18.0877L27.0643 15.3754L24.8038 13.7123H27.6753L28.5 11Z" fill="#FFDA44"/>
                          <path d="M40.5 15L41.3247 17.7123H44.1962L41.9357 19.3754L42.7604 22.0877L40.5 20.4246L38.2396 22.0877L39.0643 19.3754L36.8038 17.7123H39.6753L40.5 15Z" fill="#FFDA44"/>
                          <path d="M45 26.5L45.8247 29.2123H48.6962L46.4357 30.8754L47.2604 33.5877L45 31.9246L42.7396 33.5877L43.5643 30.8754L41.3038 29.2123H44.1753L45 26.5Z" fill="#FFDA44"/>
                          <path d="M40.5 38L41.3247 40.7123H44.1962L41.9357 42.3754L42.7604 45.0877L40.5 43.4246L38.2396 45.0877L39.0643 42.3754L36.8038 40.7123H39.6753L40.5 38Z" fill="#FFDA44"/>
                          <path d="M28.5 42L29.3247 44.7123H32.1962L29.9357 46.3754L30.7604 49.0877L28.5 47.4246L26.2396 49.0877L27.0643 46.3754L24.8038 44.7123H27.6753L28.5 42Z" fill="#FFDA44"/>
                          <path d="M16.5 38L17.3247 40.7123H20.1962L17.9357 42.3754L18.7604 45.0877L16.5 43.4246L14.2396 45.0877L15.0643 42.3754L12.8038 40.7123H15.6753L16.5 38Z" fill="#FFDA44"/>
                          <path d="M12 26.5L12.8247 29.2123H15.6962L13.4357 30.8754L14.2604 33.5877L12 31.9246L9.7396 33.5877L10.5643 30.8754L8.3038 29.2123H11.1753L12 26.5Z" fill="#FFDA44"/>
                          <path d="M16.5 15L17.3247 17.7123H20.1962L17.9357 19.3754L18.7604 22.0877L16.5 20.4246L14.2396 22.0877L15.0643 19.3754L12.8038 17.7123H15.6753L16.5 15Z" fill="#FFDA44"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 57 57" fill="none">
                          <circle cx="28.5" cy="28.5" r="28.5" fill="white"/>
                          <g clipPath="url(#circle-mask)">
                            <rect x="-10" y="6.65" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="17.29" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="27.93" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="38.57" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="49.21" width="77" height="5.32" fill="#D80027"/>
                            <rect x="-10" y="11.97" width="77" height="5.32" fill="white"/>
                            <rect x="-10" y="22.61" width="77" height="5.32" fill="white"/>
                            <rect x="-10" y="33.25" width="77" height="5.32" fill="white"/>
                            <rect x="-10" y="43.89" width="77" height="5.32" fill="white"/>
                            <rect x="-10" y="-4" width="35" height="35" fill="#2E3560"/>
                          </g>
                        </svg>
                      )}
                    </div>
                    {selectedCurrency}
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#1E1E1E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
        <div style={feesAndRateContainerStyles}>
          <div style={feesClickContainerStyles} onClick={() => setIsFeesDrawerOpen(true)}>
            Fees included
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={exchangeRateStyles}>
            1 {selectedAsset} = {selectedCurrency === 'EUR' ? '€' : '$'}{(selectedCurrency === 'USD' ? 
               (selectedAsset === 'BTC' ? btcRate * usdRate : selectedAsset === 'ETH' ? ethRate * usdRate : solRate * usdRate) :
               (selectedAsset === 'BTC' ? btcRate : selectedAsset === 'ETH' ? ethRate : solRate)
             ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
      <div style={cardFooterStyles}>
        <button 
          style={footerButtonStyles}
          onClick={handleContinue}
        >
          {mode === 'buy' ? 'Buy ' : 'Sell '}{selectedAsset}
        </button>
        <div style={poweredByStyles}>
          Powered by
          <svg xmlns="http://www.w3.org/2000/svg" width="14.4" height="9.391" viewBox="0 0 38 26" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.0123 1.04628C13.2842 0.317906 12.1036 0.317907 11.3755 1.04628L0.743984 11.6811C0.0158393 12.4095 0.0158401 13.5904 0.743985 14.3188L11.3755 24.9536C12.1036 25.682 13.2842 25.682 14.0123 24.9536L18.6354 20.329L12.627 14.3187C11.8988 13.5903 11.8988 12.4094 12.627 11.681L18.6353 5.67077L14.0123 1.04628Z" fill="#00A754"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M25.8953 1.04628C25.1671 0.317906 23.9866 0.317907 23.2584 1.04628L18.6354 5.67075L24.6438 11.681C25.3719 12.4094 25.3719 13.5903 24.6438 14.3187L18.6354 20.329L23.2584 24.9536C23.9866 25.682 25.1671 25.682 25.8953 24.9536L36.5267 14.3188C37.2549 13.5904 37.2549 12.4095 36.5267 11.6811L25.8953 1.04628Z" fill="#0A6E5C"/>
          </svg>
          <span style={poweredByBrandStyles}>Ramp Network</span>
        </div>
      </div>
      <div style={overlayStyles} onClick={() => {
        setIsDrawerOpen(false);
        setIsAssetDrawerOpen(false);
        setIsFeesDrawerOpen(false);
      }} />
      <div style={{
        ...drawerStyles,
        transform: `translateY(${isAssetDrawerOpen ? '0' : '100%'})`,
      }}>
        <div style={drawerTitleContainerStyles}>
          <div style={drawerTitleStyles}>Assets</div>
          <div style={closeButtonContainerStyles}>
            <div 
              onClick={() => setIsAssetDrawerOpen(false)}
              style={closeButtonStyles}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="#1E1E1E" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
          Popular assets (3)
        </div>
        <div style={{ width: '100%' }}>
          <div 
            style={currencyOptionStyles}
            onClick={() => handleAssetClick('BTC')}
          >
            <div style={currencyContentStyles}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 57 57" fill="none">
                <path d="M55.6622 35.2733C51.9222 50.2735 36.7278 59.4023 21.7241 55.6617C6.72681 51.9221 -2.40301 36.7284 1.33865 21.7295C5.07704 6.72773 20.2715 -2.40175 35.2704 1.33786C50.273 5.07746 59.4022 20.2728 55.6618 35.2736L55.6621 35.2733H55.6622Z" fill="#F7931A"/>
                <path d="M41.0305 24.6517C41.5839 20.9005 38.7671 18.884 34.9153 17.5389L36.1648 12.4575L33.114 11.6868L31.8976 16.6344C31.0956 16.4315 30.2719 16.2404 29.4533 16.051L30.6785 11.0707L27.6296 10.3L26.3794 15.3797C25.7157 15.2265 25.0638 15.0751 24.4314 14.9155L24.4349 14.8995L20.2278 13.8344L19.4162 17.1381C19.4162 17.1381 21.6797 17.6641 21.632 17.6965C22.8674 18.0091 23.0908 18.8383 23.0537 19.4955L21.6303 25.2844C21.7154 25.3063 21.8258 25.338 21.9475 25.3876C21.8457 25.362 21.7374 25.334 21.625 25.3067L19.63 33.4161C19.479 33.7967 19.0958 34.3678 18.232 34.1509C18.2626 34.1958 16.0147 33.5899 16.0147 33.5899L14.5 37.1306L18.4701 38.134C19.2087 38.3218 19.9325 38.5183 20.6452 38.7031L19.3828 43.8427L22.4301 44.6135L23.6803 39.5284C24.5128 39.7575 25.3207 39.9689 26.1116 40.1681L24.8656 45.2292L27.9165 46L29.1788 40.87C34.3811 41.8682 38.2928 41.4657 39.9393 36.6949C41.266 32.8538 39.8732 30.6383 37.1363 29.1935C39.1298 28.7274 40.6312 27.3981 41.0316 24.6521L41.0306 24.6514L41.0305 24.6517ZM34.0601 34.5618C33.1173 38.4029 26.7387 36.3265 24.6707 35.8058L26.346 28.9967C28.4139 29.5201 35.0455 30.5559 34.0603 34.5618H34.0601ZM35.0036 24.5961C34.1436 28.0899 28.8346 26.3149 27.1124 25.8796L28.6313 19.7041C30.3535 20.1394 35.8996 20.9517 35.0039 24.5961H35.0036Z" fill="white"/>
              </svg>
              <div style={currencyTextStyles}>
                <div style={currencyTitleStyles}>BTC</div>
                <div style={currencySubtitleStyles}>Bitcoin</div>
              </div>
            </div>
            {selectedAsset === 'BTC' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.9165 10.3613L7.68924 15.4168L17.0832 4.5835" stroke="#16A34A" strokeWidth="1.25" strokeLinecap="square"/>
              </svg>
            )}
          </div>
          <div style={dividerStyles} />
          <div 
            style={currencyOptionStyles}
            onClick={() => handleAssetClick('ETH')}
          >
            <div style={currencyContentStyles}>
              <svg width="24" height="24" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28.5" cy="28.5" r="28.5" fill="#627EEA"/>
                <path d="M28.5 8v15.177l12.832 5.731L28.5 8Z" fill="#C0CBF6"/>
                <path d="M28.5 8 15.667 28.908l12.833-5.731V8Z" fill="white"/>
                <path d="M28.5 39.647v9.345l12.837-17.775L28.5 39.647Z" fill="#C0CBF6"/>
                <path d="m28.5 48.992v-9.345l-12.833-8.43L28.5 48.992Z" fill="white"/>
                <path d="m28.5 37.145 12.832-8.237-12.832-5.731v13.968Z" fill="#8197EE"/>
                <path d="m15.667 28.908 12.833 8.237V23.177l-12.833 5.731Z" fill="#C0CBF6"/>
              </svg>
              <div style={currencyTextStyles}>
                <div style={currencyTitleStyles}>ETH</div>
                <div style={currencySubtitleStyles}>Ethereum</div>
              </div>
            </div>
            {selectedAsset === 'ETH' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.9165 10.3613L7.68924 15.4168L17.0832 4.5835" stroke="#16A34A" strokeWidth="1.25" strokeLinecap="square"/>
              </svg>
            )}
          </div>
          <div style={dividerStyles} />
          <div 
            style={currencyOptionStyles}
            onClick={() => handleAssetClick('SOL')}
          >
            <div style={currencyContentStyles}>
              <svg width="24" height="24" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <div style={currencyTextStyles}>
                <div style={currencyTitleStyles}>SOL</div>
                <div style={currencySubtitleStyles}>Solana</div>
              </div>
            </div>
            {selectedAsset === 'SOL' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.9165 10.3613L7.68924 15.4168L17.0832 4.5835" stroke="#16A34A" strokeWidth="1.25" strokeLinecap="square"/>
              </svg>
            )}
          </div>
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
                  width: '100%',
                  cursor: 'pointer'
                }}>
                  {mode === 'buy' ? 'Buying' : 'Selling'} <span style={{ fontWeight: 600 }}>{assetValue} {selectedAsset}</span> for <span style={{ fontWeight: 600 }}>{inputValue}</span>
                </div>
              </div>
              <div style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                color: '#6B7280',
                textAlign: 'left',
                paddingBottom: '8px',
                cursor: 'pointer'
              }}>
                1 {selectedAsset} = {formatFiat(getAssetRate().toString())}
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
            }}>{selectedCurrency === 'EUR' ? '€' : '$'}{calculateTotalFees()}</div>
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
      {/* Add the currency drawer */}
      <div style={{
        ...drawerStyles,
        transform: `translateY(${isDrawerOpen ? '0' : '100%'})`,
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 57 57" fill="none">
                <path d="M55.6622 35.2733C51.9222 50.2735 36.7278 59.4023 21.7241 55.6617C6.72681 51.9221 -2.40301 36.7284 1.33865 21.7295C5.07704 6.72773 20.2715 -2.40175 35.2704 1.33786C50.273 5.07746 59.4022 20.2728 55.6618 35.2736L55.6621 35.2733H55.6622Z" fill="#003399"/>
                <path d="M28.5 11L29.3247 13.7123H32.1962L29.9357 15.3754L30.7604 18.0877L28.5 16.4246L26.2396 18.0877L27.0643 15.3754L24.8038 13.7123H27.6753L28.5 11Z" fill="#FFDA44"/>
                <path d="M40.5 15L41.3247 17.7123H44.1962L41.9357 19.3754L42.7604 22.0877L40.5 20.4246L38.2396 22.0877L39.0643 19.3754L36.8038 17.7123H39.6753L40.5 15Z" fill="#FFDA44"/>
                <path d="M45 26.5L45.8247 29.2123H48.6962L46.4357 30.8754L47.2604 33.5877L45 31.9246L42.7396 33.5877L43.5643 30.8754L41.3038 29.2123H44.1753L45 26.5Z" fill="#FFDA44"/>
                <path d="M40.5 38L41.3247 40.7123H44.1962L41.9357 42.3754L42.7604 45.0877L40.5 43.4246L38.2396 45.0877L39.0643 42.3754L36.8038 40.7123H39.6753L40.5 38Z" fill="#FFDA44"/>
                <path d="M28.5 42L29.3247 44.7123H32.1962L29.9357 46.3754L30.7604 49.0877L28.5 47.4246L26.2396 49.0877L27.0643 46.3754L24.8038 44.7123H27.6753L28.5 42Z" fill="#FFDA44"/>
                <path d="M16.5 38L17.3247 40.7123H20.1962L17.9357 42.3754L18.7604 45.0877L16.5 43.4246L14.2396 45.0877L15.0643 42.3754L12.8038 40.7123H15.6753L16.5 38Z" fill="#FFDA44"/>
                <path d="M12 26.5L12.8247 29.2123H15.6962L13.4357 30.8754L14.2604 33.5877L12 31.9246L9.7396 33.5877L10.5643 30.8754L8.3038 29.2123H11.1753L12 26.5Z" fill="#FFDA44"/>
                <path d="M16.5 15L17.3247 17.7123H20.1962L17.9357 19.3754L18.7604 22.0877L16.5 20.4246L14.2396 22.0877L15.0643 19.3754L12.8038 17.7123H15.6753L16.5 15Z" fill="#FFDA44"/>
              </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 57 57" fill="none">
                <defs>
                  <clipPath id="circle-mask">
                    <circle cx="28.5" cy="28.5" r="28.5" />
                  </clipPath>
                </defs>
                <circle cx="28.5" cy="28.5" r="28.5" fill="white"/>
                <g clipPath="url(#circle-mask)">
                  <rect x="-10" y="6.65" width="77" height="5.32" fill="#D80027"/>
                  <rect x="-10" y="17.29" width="77" height="5.32" fill="#D80027"/>
                  <rect x="-10" y="27.93" width="77" height="5.32" fill="#D80027"/>
                  <rect x="-10" y="38.57" width="77" height="5.32" fill="#D80027"/>
                  <rect x="-10" y="49.21" width="77" height="5.32" fill="#D80027"/>
                  <rect x="-10" y="11.97" width="77" height="5.32" fill="white"/>
                  <rect x="-10" y="22.61" width="77" height="5.32" fill="white"/>
                  <rect x="-10" y="33.25" width="77" height="5.32" fill="white"/>
                  <rect x="-10" y="43.89" width="77" height="5.32" fill="white"/>
                  <rect x="-10" y="-4" width="35" height="35" fill="#2E3560"/>
                  <g fill="#FFFFFF">
                    <circle cx="2.5" cy="2" r="1.5"/>
                    <circle cx="8.5" cy="2" r="1.5"/>
                    <circle cx="14.5" cy="2" r="1.5"/>
                    <circle cx="20.5" cy="2" r="1.5"/>
                    <circle cx="5.5" cy="6" r="1.5"/>
                    <circle cx="11.5" cy="6" r="1.5"/>
                    <circle cx="17.5" cy="6" r="1.5"/>
                    <circle cx="2.5" cy="10" r="1.5"/>
                    <circle cx="8.5" cy="10" r="1.5"/>
                    <circle cx="14.5" cy="10" r="1.5"/>
                    <circle cx="20.5" cy="10" r="1.5"/>
                    <circle cx="5.5" cy="14" r="1.5"/>
                    <circle cx="11.5" cy="14" r="1.5"/>
                    <circle cx="17.5" cy="14" r="1.5"/>
                    <circle cx="2.5" cy="18" r="1.5"/>
                    <circle cx="8.5" cy="18" r="1.5"/>
                    <circle cx="14.5" cy="18" r="1.5"/>
                    <circle cx="20.5" cy="18" r="1.5"/>
                    <circle cx="5.5" cy="22" r="1.5"/>
                    <circle cx="11.5" cy="22" r="1.5"/>
                    <circle cx="17.5" cy="22" r="1.5"/>
                  </g>
                </g>
              </svg>
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
    </div>
  );
};

export default Container; 