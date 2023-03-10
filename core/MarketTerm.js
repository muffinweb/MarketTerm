import axios from "axios"
import loading from "loading-cli"
import cheerio  from "cheerio"
import { table } from 'table';
import MarketTermUris from "./MarketTermUris.js";



const MarketTerm = async (answers) => {
    if(answers.permissionToAction == 'Yes'){

        //TODO - Scrap doviz.com and collect related rates data.
        //     - When data is ready send them to mySQL -> table
        //     - Query Data from database, cache it with Redis, use where clause incase of need
        //     - Show results as a table in Terminal

        // [1] Process Infobar
        const load = loading('Connecting Doviz.com...').start();

        axios.get(MarketTermUris[answers.whichAsset])
            .then(async response =>  {
                console.log("\n\n");
                let dovizDocument = response.data;
                
                load.stop();
                // const data = [
                //     ['0A', '0B', '0C'],
                //     ['1A', '1B', '1C'],
                //     ['2A', '2B', '2C']
                // ];

                //Initialize Cheerio
                const $ = cheerio.load(dovizDocument);

                // Section1 and Section 2
                const dataSection_1 = $('body > div.wrapper > div.kur-page > div.article-content > div:nth-child(7) > div:nth-child(1) > div > div > table > tbody');
                const dataSection_2 = $('body > div.wrapper > div.kur-page > div.article-content > div:nth-child(7) > div:nth-child(2) > div > div > table > tbody');

                let section1Result = await new Promise((resolve,reject) => {
                    dataSection_1.find('tr').each((index, dataSection1ElemItem) => {
                        let itemResult = {};
                        itemResult.bank = $(dataSection1ElemItem).find('td:nth-child(1) > a').text();
                        console.log(itemResult);
                    })
                })

            })        
    }else{
        load.stop();
    }
}

export default MarketTerm;