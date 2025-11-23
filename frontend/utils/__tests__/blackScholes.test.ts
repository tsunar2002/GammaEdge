/**
 * Black-Scholes Pricing Engine Tests
 * 
 * This file contains tests to verify the correctness of the Black-Scholes
 * implementation against known values from academic sources and online calculators.
 */

import {
  normalCDF,
  calculateCallPrice,
  calculatePutPrice,
  calculateDelta,
  calculateGamma,
  calculateTheta,
  calculateVega,
  calculateRho,
  priceOption,
} from '../blackScholes';

// ANSI color codes for terminal output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

interface TestCase {
  name: string;
  actual: number;
  expected: number;
  tolerance?: number;
}

function runTest(test: TestCase): boolean {
  const tolerance = test.tolerance || 0.01; // Default 1% tolerance
  const diff = Math.abs(test.actual - test.expected);
  const percentDiff = test.expected !== 0 ? (diff / Math.abs(test.expected)) * 100 : diff;
  const passed = diff <= tolerance || percentDiff <= tolerance * 100;
  
  if (passed) {
    console.log(`${GREEN}✓${RESET} ${test.name}`);
    console.log(`  Expected: ${test.expected.toFixed(4)}, Got: ${test.actual.toFixed(4)}`);
  } else {
    console.log(`${RED}✗${RESET} ${test.name}`);
    console.log(`  Expected: ${test.expected.toFixed(4)}, Got: ${test.actual.toFixed(4)}, Diff: ${diff.toFixed(4)} (${percentDiff.toFixed(2)}%)`);
  }
  
  return passed;
}

function runTestSuite() {
  console.log(`\n${BOLD}${YELLOW}Black-Scholes Pricing Engine Tests${RESET}\n`);
  
  const tests: TestCase[] = [];
  let passed = 0;
  let failed = 0;
  
  // Test 1: Normal CDF
  console.log(`${BOLD}Test Suite 1: Statistical Functions${RESET}`);
  tests.push({
    name: 'normalCDF(0) should equal 0.5',
    actual: normalCDF(0),
    expected: 0.5,
    tolerance: 0.0001,
  });
  
  tests.push({
    name: 'normalCDF(1.96) should equal ~0.975',
    actual: normalCDF(1.96),
    expected: 0.975,
    tolerance: 0.001,
  });
  
  tests.push({
    name: 'normalCDF(-1.96) should equal ~0.025',
    actual: normalCDF(-1.96),
    expected: 0.025,
    tolerance: 0.001,
  });
  
  // Test 2: Call Option Pricing
  // Reference: Stock=$100, Strike=$100, T=1 year, r=5%, σ=20%
  // Expected call price ≈ $10.45 (from Black-Scholes calculator)
  console.log(`\n${BOLD}Test Suite 2: Call Option Pricing${RESET}`);
  const S = 100;
  const K = 100;
  const T = 1;
  const r = 0.05;
  const sigma = 0.20;
  
  const callPrice = calculateCallPrice(S, K, T, r, sigma);
  tests.push({
    name: 'ATM Call (S=$100, K=$100, T=1yr, r=5%, σ=20%)',
    actual: callPrice,
    expected: 10.45,
    tolerance: 0.10,
  });
  
  // ITM Call: Stock=$110, Strike=$100
  const itmCallPrice = calculateCallPrice(110, 100, T, r, sigma);
  tests.push({
    name: 'ITM Call (S=$110, K=$100, T=1yr, r=5%, σ=20%)',
    actual: itmCallPrice,
    expected: 16.73,
    tolerance: 0.20,
  });
  
  // OTM Call: Stock=$90, Strike=$100
  const otmCallPrice = calculateCallPrice(90, 100, T, r, sigma);
  tests.push({
    name: 'OTM Call (S=$90, K=$100, T=1yr, r=5%, σ=20%)',
    actual: otmCallPrice,
    expected: 5.35,
    tolerance: 0.10,
  });
  
  // Test 3: Put Option Pricing
  console.log(`\n${BOLD}Test Suite 3: Put Option Pricing${RESET}`);
  
  const putPrice = calculatePutPrice(S, K, T, r, sigma);
  tests.push({
    name: 'ATM Put (S=$100, K=$100, T=1yr, r=5%, σ=20%)',
    actual: putPrice,
    expected: 5.57,
    tolerance: 0.10,
  });
  
  // ITM Put: Stock=$90, Strike=$100
  const itmPutPrice = calculatePutPrice(90, 100, T, r, sigma);
  tests.push({
    name: 'ITM Put (S=$90, K=$100, T=1yr, r=5%, σ=20%)',
    actual: itmPutPrice,
    expected: 10.68,
    tolerance: 0.15,
  });
  
  // OTM Put: Stock=$110, Strike=$100
  const otmPutPrice = calculatePutPrice(110, 100, T, r, sigma);
  tests.push({
    name: 'OTM Put (S=$110, K=$100, T=1yr, r=5%, σ=20%)',
    actual: otmPutPrice,
    expected: 0.85,
    tolerance: 0.10,
  });
  
  // Test 4: Greeks - Delta
  console.log(`\n${BOLD}Test Suite 4: Delta Calculations${RESET}`);
  
  const callDelta = calculateDelta('call', S, K, T, r, sigma);
  tests.push({
    name: 'Call Delta (ATM)',
    actual: callDelta,
    expected: 0.6368,
    tolerance: 0.01,
  });
  
  const putDelta = calculateDelta('put', S, K, T, r, sigma);
  tests.push({
    name: 'Put Delta (ATM)',
    actual: putDelta,
    expected: -0.3632,
    tolerance: 0.01,
  });
  
  // Test 5: Greeks - Gamma
  console.log(`\n${BOLD}Test Suite 5: Gamma Calculations${RESET}`);
  
  const gamma = calculateGamma(S, K, T, r, sigma);
  tests.push({
    name: 'Gamma (ATM)',
    actual: gamma,
    expected: 0.0184,
    tolerance: 0.002,
  });
  
  // Test 6: Greeks - Vega
  console.log(`\n${BOLD}Test Suite 6: Vega Calculations${RESET}`);
  
  const vega = calculateVega(S, K, T, r, sigma);
  tests.push({
    name: 'Vega (ATM)',
    actual: vega,
    expected: 0.3685,
    tolerance: 0.02,
  });
  
  // Test 7: Weekly Options (7 days to expiry)
  console.log(`\n${BOLD}Test Suite 7: Weekly Options${RESET}`);
  
  const weeklyT = 7 / 365;
  const weeklyCallPrice = calculateCallPrice(150, 150, weeklyT, 0.045, 0.30);
  tests.push({
    name: 'Weekly ATM Call (S=$150, K=$150, T=7days, r=4.5%, σ=30%)',
    actual: weeklyCallPrice,
    expected: 2.44,
    tolerance: 0.20,
  });
  
  const weeklyPutPrice = calculatePutPrice(150, 150, weeklyT, 0.045, 0.30);
  tests.push({
    name: 'Weekly ATM Put (S=$150, K=$150, T=7days, r=4.5%, σ=30%)',
    actual: weeklyPutPrice,
    expected: 2.32,
    tolerance: 0.20,
  });
  
  // Test 8: Edge Cases
  console.log(`\n${BOLD}Test Suite 8: Edge Cases${RESET}`);
  
  // Deep ITM call should be approximately intrinsic value at expiration
  const deepITMCall = calculateCallPrice(150, 100, 0.001, r, sigma);
  tests.push({
    name: 'Deep ITM Call near expiration (intrinsic value)',
    actual: deepITMCall,
    expected: 50,
    tolerance: 1.0,
  });
  
  // Deep OTM call should be near zero
  const deepOTMCall = calculateCallPrice(100, 150, 0.001, r, sigma);
  tests.push({
    name: 'Deep OTM Call near expiration',
    actual: deepOTMCall,
    expected: 0,
    tolerance: 0.01,
  });
  
  // Test 9: priceOption function
  console.log(`\n${BOLD}Test Suite 9: Full Pricing Function${RESET}`);
  
  const optionPrice = priceOption({
    stockPrice: 100,
    strikePrice: 100,
    timeToExpiry: 1,
    riskFreeRate: 0.05,
    volatility: 0.20,
    optionType: 'call',
    bidAskSpread: 0.02,
  });
  
  tests.push({
    name: 'Full pricing function - theoretical price',
    actual: optionPrice.theoreticalPrice,
    expected: 10.45,
    tolerance: 0.10,
  });
  
  tests.push({
    name: 'Full pricing function - bid < theoretical',
    actual: optionPrice.bid < optionPrice.theoreticalPrice ? 1 : 0,
    expected: 1,
    tolerance: 0,
  });
  
  tests.push({
    name: 'Full pricing function - ask > theoretical',
    actual: optionPrice.ask > optionPrice.theoreticalPrice ? 1 : 0,
    expected: 1,
    tolerance: 0,
  });
  
  // Run all tests
  console.log(`\n${BOLD}${YELLOW}Running All Tests...${RESET}\n`);
  
  for (const test of tests) {
    if (runTest(test)) {
      passed++;
    } else {
      failed++;
    }
  }
  
  // Summary
  console.log(`\n${BOLD}${YELLOW}Test Summary${RESET}`);
  console.log(`${GREEN}Passed: ${passed}${RESET}`);
  console.log(`${RED}Failed: ${failed}${RESET}`);
  console.log(`Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log(`\n${GREEN}${BOLD}✓ All tests passed!${RESET}\n`);
  } else {
    console.log(`\n${RED}${BOLD}✗ Some tests failed${RESET}\n`);
    process.exit(1);
  }
}

// Run the test suite
runTestSuite();
