const { createAvatar } = require('@dicebear/avatars');//'../dicebear/packages/@dicebear/avatars');
const style = require('@dicebear/open-peeps');//'../dicebear/packages/@dicebear/open-peeps');
const Rarepress = require('rarepress');
let fungible = false;
let fungibleSupply = 210000;
let type = fungible ? "ERC1155" : "ERC721";
let supply = fungible ? fungibleSupply : 1;
let royalty = 2000;
console.log("Begin mint. \n Is fungible = ${fungible}. \n Fungible supply = ${fungibleSupply}. \n Type = ${type}. \n Supply = ${supply}. \n Royalty = ${royalty}.");
(async () => {
    const rarepress = new Rarepress();
    await rarepress.init({network:"mainnet"});
    console.log("Rarepress init.");
    for(let i = 0; i <1000; i++){
        seed = 3693564 + i
        console.log("Begin create avatar for ${i}.");
        let svg = createAvatar(style, {seed:seed.toString()});
        let cid = await rarepress.fs.add(Buffer.from(svg))
        console.log("Begin create token for CID " + cid + ".");
        let token = await rarepress.token.create({
            type:type,
            metadata:{
                name: i.toString(),
                description: 'The peeps are here to feed on your gas fees!',
                image: '/ipfs/'+cid,
                attributes:[
                    {
                        trait_type:"Hunger",
                        value:10*i
                    },
                    {
                        trait_type:"Stamina",
                        value:5*i
                    },
                    {
                        trait_type:"Intelligence",
                        value:3*i
                    }
                ]
            },
            //uncomment if non-fungible
            //supply:supply,
            royalty:royalty,
        })
        console.log("Begin push to rarepress.");
        await rarepress.fs.push(cid)
        await rarepress.fs.push(token.uri)
        let sent = await rarepress.token.send(token)
        console.log("End push to rarepress.");
        let tokenPrice = 10**18;
        console.log("Begin trade.");
        let trade = await rarepress.trade.create({
            what:{
                type:type,
                id:token.token.tokenID
            },
            with:{
                type:"ETH",
                value:tokenPrice
            }
        })
        let receipt = await rarepress.trade.send(trade)
        console.log('/['+i.toString()+'] published: https://rarible.com/token/'+sent.id)
    }
})();
