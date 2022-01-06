const fileName = 'food_1.json'
//
const sanitizeHtml = require('sanitize-html');
const fs = require('fs')

async function main() {
    // Use connect method to connect to the server
    const raw = fs.readFileSync(fileName)

    const foods = JSON.parse(raw);
    console.log(foods)
    const filterFoods = foods.map(food => {
        return {
            ...food,
            description: sanitizeHtml(food.description, {
                allowedTags: [],
                allowedAttributes: {}
            })
        }
    })
    fs.writeFileSync("filter.json", JSON.stringify(filterFoods))
    return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

