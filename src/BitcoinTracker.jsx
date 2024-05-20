import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { interval, switchMap, map, startWith } from 'rxjs';

/**
 * Function to fetch the current Bitcoin price from the CoinGecko API.
 * @returns A promise that resolves to the Axios response for the Bitcoin price.
 */
const fetchBitcoinPrice = () => {
  return axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
};

const BitcoinTracker = () => {
  const [price, setPrice] = useState(null); // State to hold the current price of Bitcoin

  useEffect(() => {
    // Define an observable that starts immediately and then emits values every 60 seconds
    const price$ = interval(1000 * 60).pipe(
      startWith(0), // Emit an initial value immediately to trigger the first fetch
      switchMap(() => fetchBitcoinPrice()), // On each emission, fetch the new Bitcoin price
      map(response => response.data.bitcoin.usd) // Extract the Bitcoin price from the response
    ).subscribe(
      (newPrice) => {
        setPrice(newPrice); // Update the price state with the new price
      },
      (error) => {
        console.error('Error fetching Bitcoin price:', error); // Log any errors
      }
    );

    // Cleanup: Unsubscribe from the observable to prevent memory leaks
    return () => price$.unsubscribe();
  }, []);

  return (
    <div style={{padding: '20px'}}>
      <h1>Bitcoin Price Tracker</h1>
      <p>Current Price: ${price ? price.toLocaleString() : 'Loading...'}</p>
    </div>
  );
};

export default BitcoinTracker;
