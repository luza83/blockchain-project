process.env.NETWORK = 'testnet';

const WhatsOnChain = require ('whatsonchain/index.js');


function buildTx(
  prkWif, 
  msg,
  pAdress
  )
  {
  const {
    Address,
    TxBuilder,
    TxOut,
    KeyPair,
    Bn,
    PrivKey,
    Script,
    Tx
  } = require('bsv');

  
  const woc =new WhatsOnChain( 'testnet' );  

  const access_chain = async  (param) => {
      console.log("Contacting WhatsOnChain...");
      try {
            return await woc.utxos(param);
      }
      catch (e) {
          console.log(e);
      }
  }

  async function broadcast_tx (utxos, utxo_from) {
      let builder = new TxBuilder();

      let fLen = utxos.length;

      for (let i = 0; i < fLen ; i++){ // add all your available utxos as possible inputs for the next tx
        const utxo_value = utxos[i].value;
        const utxo_index = utxos[i].tx_pos;  //-- Update this for every new tx
        const utxo_txid = utxos[i].tx_hash;

        // Start to build the tx. Everything about Building transactions is present at Github : bsv/lib/tx-builder.js
        const utxo_fund = TxOut.fromProperties( // satoshis in output, script
          Bn().fromNumber(utxo_value),
          Address.Testnet.fromString(utxo_from).toTxOutScript()
        );
          
        const utxo_txid_buff = Buffer.from(utxo_txid, 'hex').reverse();
        
        builder.inputFromPubKeyHash(utxo_txid_buff, utxo_index, utxo_fund);  // tx.id, utxo.n, utxo.value, utxo.address
    
    } //TxIns end

      const change_addr = utxo_from;
      const keyPairs = [KeyPair.Testnet.fromPrivKey(PrivKey.fromWif(prkWif))];
    
      let msg_to_write = [msg];
      const data = msg_to_write.map((str) => { // Admits several strings on the list msg_to_write
        return Buffer.from(str);
      });
    

      builder.outputToScript (
        Bn().fromNumber(0),
        Script.fromSafeDataArray(data)
      ) ;
      
      builder.setChangeAddress(Address.Testnet.fromString(change_addr));   // Set change address 

      builder.build({ useAllInputs: false }); // This saves the tx inside the "tx" attribute. Build tx
    
      builder.signWithKeyPairs(keyPairs);   // sign

      let signed_tx = builder.tx.toHex();

      let result = woc.broadcast(signed_tx);

      return result;

    }
  
  let pub_addr = pAdress;
  access_chain(pub_addr).then(result => broadcast_tx(result, pub_addr).then(tx_return => console.log(tx_return) ));
 

}

function getvalue (){
    
  const wif = document.getElementById('wif').value;
  const txt = document.getElementById('txt').value;
  const addrs = document.getElementById('addrs').value;


  ntx = buildTx(wif, txt, addrs);
  link = "https://test.whatsonchain.com/address/"+ addrs
  document.getElementById("newTx").innerHTML= "Your transaction has been created, click <a href = '" + link + "'>here</a> to see it at whatsonchain";
 
}

window.getvalue = getvalue 


