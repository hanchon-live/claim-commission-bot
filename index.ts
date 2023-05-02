import { Wallet } from "@ethersproject/wallet";
import {
  broadcast,
  getSender,
  MAINNET_CHAIN,
  signTransaction,
} from "@hanchon/evmos-ts-wallet";

import {
  createTransaction,
  createMsgWithdrawValidatorCommission,
  createAnyMessage,
} from "@evmos/proto";
import * as authz from "@evmos/proto/dist/proto/cosmos/authz/v1beta1/tx";
import { Sender, TxGenerated } from "@evmos/transactions";
import * as dotenv from "dotenv";
dotenv.config();

export function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// Constants
const MNEMONIC = process.env.MNEMONIC;
const VALIDATOR_ADDRESS = process.env.VALIDATOR_ADDRESS;
const ENDPOINT = "https://rest.bd.evmos.org:1317";

// Create the transaction that needs to be sent
function createTx(sender: Sender) {
  let protos = [];
  protos.push(
    createAnyMessage(createMsgWithdrawValidatorCommission(VALIDATOR_ADDRESS))
  );

  const msgExec = new authz.cosmos.authz.v1beta1.MsgExec({
    grantee: sender.accountAddress,
    msgs: protos,
  });

  const message = { message: msgExec, path: "cosmos.authz.v1beta1.MsgExec" };

  return createTransaction(
    message,
    "",
    "4000000000000000",
    "aevmos",
    150000,
    "ethsecp256",
    sender.pubkey,
    sender.sequence,
    sender.accountNumber,
    MAINNET_CHAIN.cosmosChainId
  );
}

const main = async () => {
  console.log("Getting sender");
  const wallet = Wallet.fromMnemonic(MNEMONIC);

  let sender: Sender;
  try {
    sender = await getSender(wallet, ENDPOINT);
  } catch (e) {
    console.error("Couldn't get the sender");
    return;
  }

  console.log(`Sending transaction with sequence: ${sender.sequence}`);

  const msg = createTx(sender);
  const signedTransaction = await signTransaction(wallet, msg as TxGenerated);

  const RETRY_MAX = 10;
  let retry = RETRY_MAX;

  while (retry > 0) {
    const broadcastRes = await broadcast(signedTransaction, ENDPOINT);
    if (broadcastRes.tx_response.code === 0) {
      // Transaction success
      console.log(`Success: ${broadcastRes.tx_response.txhash}`);
      break;
    } else if (broadcastRes.tx_response.code === 19) {
      // Already broadcasted
      console.log(`Already boarcasted: ${broadcastRes.tx_response.txhash}`);
      break;
    } else {
      // Retry
      console.log(`Error: ${JSON.stringify(broadcastRes.tx_response)}`);
      retry = retry - 1;
      await sleep(7000);
    }
  }
  console.log("Script finished");
};

(() => main())();
