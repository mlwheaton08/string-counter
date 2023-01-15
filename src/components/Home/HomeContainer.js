import { AwaitingPayment } from "./AwaitingPayment"
import { AwaitingShipment } from "./AwaitingShipment"

export const HomeContainer = () => {

    return <>
        <h1>Home Component</h1>
        <AwaitingShipment />
        <AwaitingPayment />
    </>
    // need logic for customs (and sjoySkus if doing this way) that adds the wound strings to the correct count by alloy (plain vs wound should be fine bc of the p and w in the names)
    // need to include single and bulk strings! will be separate function
    // for manual orders where can't grab each string, maybe somehow log a message to see what happens when it can't detect manual order strings (maybe nothing would happen honestly). log a message that includes the quantity of item so we know if it's substatantial or not
    // maybe there's a way to get manual custom strings? would be a later goal and need some brainstorming
    // don't worry about detecting alt skus yet, but rather for now have it console log a message of the sku that didn't match any sku in the database
}