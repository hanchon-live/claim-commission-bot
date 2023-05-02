# Claim commission bot

A simple TS bot to claim a validator commission

## Set up your env file

```sh
cp .env.example .env
```

Edit the `.env` file:

- Paste your bot's mnemonics in the `MNEMONIC` variable.
- Paste your validator address in the `VALIDATOR_ADDRESS` variable.

## Run the bot

Install the node dependencies:

```sh
yarn install
```

After setting up your `.env` file, run the claim script.

```sh
yarn run claim
```

## Authz

If you haven't granted authz permissions to your bot's wallet, you can do it by sending this transaction from your validator's wallet.

```sh
evmosd tx authz grant <bot_address> generic --msg-type /cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission --chain-id evmos_9001-2 --from <wallet_name> --fees 50000000000000000aevmos --node https://tendermint.bd.evmos.org:26657
```
