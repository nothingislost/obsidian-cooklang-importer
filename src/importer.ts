import recipeScraper from "recipe-scraper";
import parseIngredient, { Ingredient } from "parse-ingredient";
import { Notice } from "obsidian";

interface ParsedIngredient {
  original: string;
  parsed: Ingredient;
}
interface IngredientResults {
  found: ParsedIngredient[];
  missing: ParsedIngredient[];
}

export async function scrapeRecipe(url: string): Promise<{ name: string; content: string }> {
  let recipe;
  try {
    recipe = await recipeScraper(url);
  } catch (err) {
    new Notice("Cooklang Importer Error: Unable to parse recipe");
    return;
  }
  let parsedIngredients;
  let recipeText = [];
  [recipe, parsedIngredients] = updateIngredients(recipe);
  recipeText.push("-- Parsed Metadata");
  recipeText.push(">> name: " + recipe.name);
  recipeText.push(">> description: " + recipe.description);
  recipeText.push(">> source: " + url);
  recipeText.push(">> tags: " + recipe.tags.join(", "));
  recipeText.push(">> prep time: " + recipe.time.prep);
  recipeText.push(">> cook time: " + recipe.time.cook);
  recipeText.push(">> servings: " + recipe.servings);
  recipeText.push(">> image: " + (recipe.image ? recipe.image : ""));
  recipeText.push("");
  recipeText.push("-- Parsed Ingredients");
  for (let ingredient of parsedIngredients.found) {
    recipeText.push("-- ✅ original: " + ingredient.original);
    recipeText.push("-- ✅ parsed: " + formatIngredient(ingredient.parsed));
    recipeText.push("");
  }
  recipeText.push("-- Unparsed Ingredients");
  for (let ingredient of parsedIngredients.missing) {
    recipeText.push("-- ❌ original: " + ingredient.original);
    recipeText.push("-- ❌ parsed: " + formatIngredient(ingredient.parsed));
    recipeText.push("");
  }
  recipeText.push("-- Parsed Instructions");
  for (let section of recipe.instructions) {
    recipeText.push(section);
    recipeText.push("");
  }
  return { name: recipe.name, content: recipeText.join("\r\n") };
}

function formatIngredient(ingredient: Ingredient) {
  let description = ingredient.description;
  let quantity = ingredient.quantity ? ingredient.quantity : "";
  let unit = ingredient.quantity && ingredient.unitOfMeasure ? "%" + ingredient.unitOfMeasure : "";
  return `@${description}{${quantity}${unit}}`;
}

function updateIngredients(recipe: any) {
  let parsedIngredients: IngredientResults = { found: [], missing: [] };
  recipe.ingredients.forEach((ingredient: string) => {
    ingredient = ingredient.replace("*", ""); // removing some special characters
    let parsedIngredient = parseIngredient(ingredient)?.pop();
    let found = false;
    for (let index = 0; index < recipe.instructions.length; index++) {
      const instruction = recipe.instructions[index];
      let ingredientIndex = instruction.indexOf(parsedIngredient.description);
      if (ingredientIndex > 0) {
        const pair = Array.from(instruction);
        pair.splice(ingredientIndex, parsedIngredient.description.length, formatIngredient(parsedIngredient));
        recipe.instructions[index] = pair.join("");
        parsedIngredients.found.push({ original: ingredient, parsed: parsedIngredient });
        found = true;
        break;
      }
    }
    if (!found) {
      parsedIngredients.missing.push({ original: ingredient, parsed: parsedIngredient });
    }
  });
  return [recipe, parsedIngredients];
}
