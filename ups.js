process.env.NETWORK = 'testnet';


const WhatsOnChain = require ('whatsonchain/index.js');

const what = async function ( param ) {

    console.log("Contacting WhatsOnChain...");

    const woc = new WhatsOnChain( 'testnet' ); 

  try {
       return await woc.txHash(param);
    }
    catch (e) {
        console.log(e);
    }
}
const hist = async function ( param ) {

    console.log("Contacting WhatsOnChain...");

    const woc = new WhatsOnChain( 'testnet' ); 

  try {
       return await woc.history(param);
    }
    catch (e) {
        console.log(e);
    }
}


const get_ups = function(hx){
    hist(hx).then(result=>{
        for(let i = 0; i < result.length; i++){
            what(result[i].tx_hash).then(res => {
                let fLen = res.vout.length;
            
                for (let i = 0; i < fLen; i++) {
                    let scriptHex = res.vout[i].scriptPubKey.hex; 
                    const isData = scriptHex.startsWith("006a");
                    if (isData) {
                        const to_txt = Buffer.from(scriptHex.substring(4), "hex").toString()
                        const Str = to_txt.substring(to_txt.indexOf("{"))// clean  data that came from blockchain
                        const output = JSON.parse(Str);// convert to JSON
        

                        var total = parseInt(output.kgIn)
                        var d = output.id
                        var dt = new Date(d);
                        var date = dt.toDateString(); // formating Id to date
                        // keeping track of what comes in and out in each firma
                        let stat = total - parseInt(output.kgOut)// updating in-stock status 
                        document.getElementById("lst").innerHTML += `Date: ${date}.<br>Firma ${output.org} has ${total}kg from ${output.src}. <br>
                        Firma ${output.org} sold ${output.kgOut} kg to firma ${output.to}. <br> Firma ${output.org} has remaining ${stat} kg.<br><br>`
                        //console.log(`Firma ${output.org} has ${total}kg `)
                        //console.log(`Firma ${output.org} sold ${output.kgOut} kg`) 
                        //console.log(`Firma ${output.org} has remaining ${stat} kg`) 
                        
                        
                    }
                
                }
            })
            
        }
    })    
           
}

//get_ups("mmnj52Qet6ysEfgGiSu8GoJ3AkULkgcFjL")
window.get_ups = get_ups;

