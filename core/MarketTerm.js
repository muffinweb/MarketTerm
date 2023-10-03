import axios from "axios"
import loading from "loading-cli"
import cheerio  from "cheerio"
import { table } from 'table';
import consoleTableConfig from '../config/consoleTableConfig.js'
import MarketTermUris from "./MarketTermUris.js";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";


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

                //Initialize Cheerio
                const $ = cheerio.load(dovizDocument);

                // Section1 and Section 2
                const dataSection_1 = $('body > div.wrapper > div.kur-page > div.article-content > div:nth-child(7) > div:nth-child(1) > div > div > table > tbody');
                const dataSection_2 = $('body > div.wrapper > div.kur-page > div.article-content > div:nth-child(7) > div:nth-child(2) > div > div > table > tbody');

                const generalResults = [];

                let section1Result = await new Promise((resolve,reject) => {
                    let dataSection_1FindLength = dataSection_1.find('tr').length;

                    let loopInResult = [];

                    dataSection_1.find('tr').each((index, dataSection1ElemItem) => {
                        let itemResult = {};
                        itemResult.bank = $(dataSection1ElemItem).find('td:nth-child(1) > a').text();
                        
                        itemResult.buyRate = parseFloat($(dataSection1ElemItem).find('td:nth-child(2)').text().replace(',','.'));
                        itemResult.sellRate = parseFloat($(dataSection1ElemItem).find('td:nth-child(3)').text().replace(',', '.'));

                        //Calculate buy/sell diff rate
                        let buySellDiffRate = ((itemResult.sellRate-itemResult.buyRate)/itemResult.buyRate)*100;
                        itemResult.buySellDiffRate = buySellDiffRate;

                        //Add related result item to final result
                        loopInResult.push(itemResult);

                        if(index+1 == dataSection_1FindLength){
                            resolve(loopInResult);
                            generalResults.push(loopInResult);
                        }

                    })
                });

                let section2Result = await new Promise((resolve,reject) => {
                    let dataSection_2FindLength = dataSection_2.find('tr').length;

                    let loopInResult = [];

                    dataSection_2.find('tr').each((index, dataSection2ElemItem) => {
                        let itemResult = {};
                        itemResult.bank = $(dataSection2ElemItem).find('td:nth-child(1) > a').text();
                        
                        itemResult.buyRate = parseFloat($(dataSection2ElemItem).find('td:nth-child(2)').text().replace(',','.'));
                        itemResult.sellRate = parseFloat($(dataSection2ElemItem).find('td:nth-child(3)').text().replace(',', '.'));

                        //Calculate buy/sell diff rate
                        let buySellDiffRate = ((itemResult.sellRate-itemResult.buyRate)/itemResult.buyRate)*100;
                        itemResult.buySellDiffRate = buySellDiffRate;

                        //Add related result item to final result
                        loopInResult.push(itemResult);

                        if(index+1 == dataSection_2FindLength){
                            resolve(loopInResult);
                            generalResults.push(loopInResult);
                        }

                    })
                });

                let finalResults = [].concat(generalResults[0], generalResults[1]);
                
                //Now Let's connect mongoDB and insert values
                mongoose.connect('mongodb://admin:password@mongo:27017/admin');

                const MarketTermLog = mongoose.model('MarketTermLog', {
                    bank: String,
                    buyRate: Number,
                    sellRate: Number,
                    buySellDiffRate: Number
                });

                let sampleLog = new MarketTermLog({
                    bank: 'Halkbank',
                    buyRate: 123.22,
                    sellRate: 22.3324,
                    buySellDiffRate: 1.2244
                });

                sampleLog.save().then(() => console.log('DID IT'));


                

                let dataConsoleTable = [[answers.whichAsset + " Market Report", "", "", ""], ['Bank', 'Buy', 'Sell', 'Diff Rate']];

                for(const[key,value] of Object.entries(finalResults)){
                    let currentRow = [];
                    currentRow.push(value.bank);
                    currentRow.push(value.buyRate);
                    currentRow.push(value.sellRate);
                    currentRow.push(value.buySellDiffRate);
                    
                    dataConsoleTable.push(currentRow);
                }

                console.log(table(dataConsoleTable, consoleTableConfig))

            })        
    }else{
        load.stop();
    }
}

export default MarketTerm;