declare module "recipe-scraper" {
  function recipeScraper(url: string): Promise<Recipe>;

  interface Recipe {
    name: string;
    ingredients: string[];
    instructions: string[];
    tags: string[];
    servings: string;
    image: string;
    time: {
      prep: string;
      cook: string;
      active: string;
      inactive: string;
      ready: string;
      total: string;
    };
  }
  export = recipeScraper;
}
