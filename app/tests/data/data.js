export const data = new Array(10).fill(0).map((_, i) => ({
  name: `Test ${i + 1}`,
  content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Dolor voluptatibus ea quasi illum pariatur aspernatur.Alias quia mollitia voluptatum modi consequuntur, eveniet ullam blanditiis maxime cumque iure.Magni sapiente a omnis voluptatibus eos.Placeat dolor necessitatibus ut officiis consequuntur vitae repudiandae, tempore ducimus fuga in, quis accusamus facilis libero.Dolores."
}));
/*
content: 
[
  {
    collapsed: false,
    startLine: 1,
    lineContent: "Lorem ipsum",
  },
  {
    collapsed: true,
    startLine: 2,
    lineContent: [
      "dolor sit amet",
      "consectetur adipisicing elit.",
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.Dolor voluptatibus ea quasi illum pariatur aspernatur.Alias quia mollitia voluptatum modi consequuntur, eveniet Lorem ipsum dolor sit amet consectetur adipisicing elit.Dolor voluptatibus ea quasi illum pariatur aspernatur.Alias quia mollitia voluptatum modi consequuntur, eveniet "
    ]
  },
  {
    collapsed: false,
    startLine: 5,
    lineContent: "Dolor voluptatibus ea quasi illum pariatur aspernatur."
  }
]
*/

