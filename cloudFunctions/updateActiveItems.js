Moralis.Cloud.afterSave("ItemListed", async (request) => {
    //every events triggered twice, once on unconfirmed ,again on confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed Tx")
    if (confirmed) {
        logger.info("Found Item!")
        const ActiveItem = Moralis.Object.extend("ActiveItem")

     
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("seller", request.object.get("seller"))
        logger.info(`Marketplace | Query: ${query}`)
        const alreadyListedItem = await query.first()
        console.log(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`)
        if (alreadyListedItem) {
            logger.info(`Deleting ${alreadyListedItem.id}`)
            await alreadyListedItem.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} since the listing is being updated. `
            )
        }

        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftAddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))
        logger.info(
            `Adding Address: ${request.object.get("address")},TokneId:${request.object.get(
                "tokenId"
            )}`
        )
        logger.info("Saving......")
        await activeItem.save()
    }
})

Moralis.Cloud.afterSave("ItemCancled", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()

    logger.info(`Marketplace | Object: ${request.object}`)
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        logger.info(`Marketplace | Query: ${query}`)
        const cancledItem = await query.first()
        logger.info(`Marketplace | CanceledItem: ${cancledItem}`)
        if (cancledItem) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )} since it was cancled`
            )
            await cancledItem.destroy()
        } else {
            logger.info(
                `No item was found with address ${request.object.get(
                    "address"
                )} tokenId: ${request.object.get("tokenId")}`
            )
        }
    }
})

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()

    logger.info(`Marketplace | object:${request.object}`)
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        logger.info(`Marketplace | Query: ${query}`)
        const boughtItem = await query.first()
        logger.info(`Marketplace | BoughtItem: ${boughtItem}`)
        if (boughtItem) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )}`
            )
            await boughtItem.destroy()
        } else {
            logger.info(
                `No item was found with address ${request.object.get(
                    "address"
                )}tokenId: ${request.object.get("tokenId")}`
            )
        }
    }
})
