# Account Abstraction demo app

[The Safe{Core} Account Abstraction SDK](https://github.com/safe-global/account-abstraction-sdk) allows builders to add account abstraction functionality into their apps. This demo is an example on how to use our different packages (Auth Kit, OnRamp Kit & Relay Kit).

See the [Safe{Core} Account Abstraction SDK Docs](https://docs.gnosis-safe.io/learn/safe-core-account-abstraction-sdk) for more details.

## Installation

To run this project locally:

Install deps:

```bash
yarn install
```

Create a `.env` file (see `example.env`)

```
# see https://web3auth.io/docs/developer-dashboard/get-client-id
REACT_APP_WEB3AUTH_CLIENT_ID=

REACT_APP_STRIPE_BACKEND_BASE_URL=https://aa-stripe.safe.global

REACT_APP_STRIPE_PUBLIC_KEY=pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO

```

Run the demo App:

```bash
yarn start
```
