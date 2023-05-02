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

## Docker

If you have errors because your local node version, you can run the code inside a docker container:

```sh
docker run -it --platform=linux/amd64 ubuntu:focal
apt-get update && apt-get install git curl -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source /root/.bashrc
nvm install v18.12.0
cd /root
git clone https://github.com/hanchon-live/claim-commission-bot.git
cd claim-commission-bot/
npm install -g yarn
yarn install
# create the .env file
yarn run claim
```
