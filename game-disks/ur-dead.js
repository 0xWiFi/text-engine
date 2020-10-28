const urDead = {
  roomId: 'court',
  inventory: [
    {name: 'compass', desc: `You'd held onto it as a keepsake, even though in life the busted thing didn't work at all. Weirdly enough, it seems to function fine down here.`}
  ],
  rooms: [
    {
      name: 'Craggy Half-Court',
      id: 'court',
      img: `
      .-.
     (o.o)
      |=|
     __|__
   //.=|=.\\\\
  // .=|=. \\\\
  \\\\ .=|=. //
   \\\\(_=_)//
    (:| |:)
     || ||
     () ()
     || ||
     || ||
    ==' '==
      `,
      onEnter: () => {
        const room = getRoom('court');

        if (room.visits === 1) {
          println(`The bad news is you are dead. The good news is, it's not so bad. Type LOOK to have a look around.`);

          room.desc = `You see a couple of skeletons playing HORSE. A gate leads NORTH.`;
        }
      },
      items: [
        {
          name: 'hoop',
          desc: [`It's a hoot. [Not a typo. --ED]`],
        },
        {
          name: ['basketball', 'ball'],
          desc: 'You could really have a ball with that thing.',
          isTakeable: true,
          onTake: ({item, room}) => {
            room.desc = `You see a couple of skeletons. You get the feeling they don't care for you.`;
            println(`One of the skeletons performs an elaborate dance to set up their shot, dribbling out a steady beat. They are clearly banking on the other forgetting one of the many the steps, and thus adding an 'O' to their 'H'. They're so swept up in their routine that you're able to step in and swipe the ball on a down beat.

            The skeletons don't look happy. (Later, you will confoundedly try to remember how you could TELL they looked uphappy.)`);
            item.desc = 'You could really have a ball with this thing.';
            item.use = () => println(`It's a bit hard to dribble on the uneven floor, but you manage to do so awkwardly.`);


            const skeletons = findCharacter('skeletons');

            // Set the skeletons back to playing basketball.
            const reset = () => {
              skeletons.topics = 'They look pretty busy.';
              endConversation();

              // Put the ball back in the room.
              item.use = () => println(`You'll have to take it first.`);
              room.items.push(item);
              const itemIndex = disk.inventory.findIndex(i => i === item);
              disk.inventory.splice(itemIndex, 1);
            };

            skeletons.topics = [
              {
                option: 'Use the leverage to get INFO',
                keyword: 'info',
                cb: () => {
                  println(`You offer to return the ball if they'll just answer some questions. They beat you up and take the ball back.`);
                  reset();
                },
              },
              {
                option: 'GIVE the ball back',
                keyword: 'give',
                cb: () => {
                  println(`Feeling a bit bad, you decide to return the ball and move on.`);
                  reset();
                },
              },
            ];
          },
          use: () => println(`You'll have to take it first.`),
        }
      ],
      exits: [{dir: 'north', id: 'beach'}],
    },
    {
      name: 'The "Beach"',
      id: 'beach',
      desc: `There's a sign that reads "Death's a Beach." There's sand, to be sure, but there's no water in sight. And the sky is a pitch-black void.

To the NORTH you see a yaught in the sand, lit up like a Christmas tree. You hear the bassy thumping of dance music.

To the SOUTH is the gate to the half-court.

There's a bearded skeleton by the sign. He seems to want to TALK.`,
      items: [
        {name: 'sign', desc: `It says: DEATH'S A BEACH.`},
        {name: 'yaught', desc: `You can't see it too clearly from here. You'll need to go further NORTH.`},
      ],
      exits: [{dir: 'south', id: 'court'}],
    }
  ],
  characters: [
    {
      name: ['the skeletons', 'skeletons'],
      desc: [`They look competitive.`, `They're still on 'H'.`],
      roomId: 'court',
      topics: `They look pretty busy.`,
      onTalk: () => println(`"Give it back," one of them says.`),
    },
    {
      name: 'skeleton',
      desc: `He appears to have something to say. Or at least, he keeps clearing his throat. Or, that is, if he had a throat... This is a confusing place.`,
      roomId: 'beach',
      topics: [
        {
          option: 'TODO item',
          keyword: 'todo',
          cb: () => println(`TODO: Give me some topics that lay out the player's goals in this game.`),
        },
      ],
      onTalk: () => println(`"You're dead," he says in a scratchy voice, "You must've gathered that much."`),
    },
  ],
};
