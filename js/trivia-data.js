// [question, correct answer, wrong, wrong, wrong]
// TRIVIA[season 0-4][tier 0-2]  — each game draws 5 at random from each list of 8.
const TRIVIA = [
 // ================= SEASON 1 =================
 [[
  ["What game are the boys playing in the Wheelers' basement when the story begins?", "Dungeons & Dragons", "Risk", "Monopoly", "Atari"],
  ["Which boy vanishes on his way home that night?", "Will Byers", "Mike Wheeler", "Dustin Henderson", "Lucas Sinclair"],
  ["What frozen breakfast food does Eleven fall in love with?", "Eggo waffles", "Pop-Tarts", "Toaster Strudel", "Frozen pancakes"],
  ["What does Joyce string up around the house to talk to Will?", "Christmas lights", "Tin cans", "Candles", "Wind chimes"],
  ["What number is tattooed on Eleven's wrist?", "011", "001", "008", "111"],
  ["In which state is Hawkins?", "Indiana", "Ohio", "Illinois", "Maine"],
  ["Who is Hawkins' chief of police?", "Jim Hopper", "Bob Newby", "Ted Wheeler", "Murray Bauman"],
  ["What do the boys name the monster, after a D&D creature?", "The Demogorgon", "The Mind Flayer", "Vecna", "The Thessalhydra"]
 ],[
  ["In what month and year does Will disappear?", "November 1983", "October 1984", "July 1985", "March 1986"],
  ["What is the name of Will's fort in the woods?", "Castle Byers", "Fort Will", "The Hideout", "Byers Keep"],
  ["Which teacher explains other dimensions with 'the flea and the acrobat'?", "Mr. Clarke", "Mr. Mundy", "Ms. Kelley", "Coach Carter"],
  ["Where is Barb sitting when she is taken?", "By Steve's swimming pool", "In her car", "At the quarry", "In the school gym"],
  ["Where does Eleven first find food after escaping the lab?", "Benny's Burgers", "Enzo's", "Scoops Ahoy", "Melvald's"],
  ["What do the kids fill with salt water so Eleven can find Will?", "A kiddie pool", "A bathtub", "A fish tank", "A rain barrel"],
  ["What does Eleven call Dr. Brenner?", "Papa", "Doctor", "Sir", "Father"],
  ["Which Clash song connects Will and Jonathan?", "Should I Stay or Should I Go", "London Calling", "Rock the Casbah", "Train in Vain"]
 ],[
  ["How much salt does Mr. Clarke say the homemade tank needs?", "1,500 pounds", "500 pounds", "50 pounds", "5,000 pounds"],
  ["What was the name of Hopper's daughter?", "Sara", "Jane", "Diane", "Holly"],
  ["Which secret program did Terry Ives take part in?", "MKUltra", "Project Blue Book", "Operation Paperclip", "Project Nina"],
  ["What number did Will roll when the Demogorgon 'got him' in the campaign?", "A seven", "A one", "A thirteen", "A twenty"],
  ["What is the name of the Byers family dog?", "Chester", "Buster", "Tews", "Rocky"],
  ["What does Hopper leave in a box in the woods at the end of the season?", "Eggo waffles", "A walkie-talkie", "A wig", "A flashlight"],
  ["What do the boys call the road where Will disappeared?", "Mirkwood", "Rivendell", "Moria", "The Shire Road"],
  ["What was the show's working title before it was renamed?", "Montauk", "Hawkins", "Indiana", "The Lab"]
 ]],
 // ================= SEASON 2 =================
 [[
  ["What does Dustin name the strange creature he finds in his trash can?", "D'Artagnan (Dart)", "Yurtle", "Mews", "Nougat"],
  ["What nickname does the new girl Max use at the arcade?", "MADMAX", "ZOOMER", "REDQUEEN", "SK8RGRL"],
  ["Which holiday is the party celebrating when the season begins?", "Halloween", "Christmas", "Thanksgiving", "Fourth of July"],
  ["Who do the boys dress up as for trick-or-treating?", "The Ghostbusters", "The A-Team", "Star Wars heroes", "KISS"],
  ["What is the name of the arcade in Hawkins?", "The Palace Arcade", "Rink-O-Mania", "Family Video", "The War Zone"],
  ["Who is Max's stepbrother?", "Billy Hargrove", "Steve Harrington", "Tommy H.", "Jason Carver"],
  ["Which older teen becomes Dustin's unlikely partner and babysitter?", "Steve Harrington", "Jonathan Byers", "Billy Hargrove", "Eddie Munson"],
  ["Who has been hiding Eleven in a cabin in the woods?", "Hopper", "Joyce", "Mike", "Dr. Owens"]
 ],[
  ["On which arcade game does MADMAX beat Dustin's high score?", "Dig Dug", "Dragon's Lair", "Pac-Man", "Galaga"],
  ["Who is Joyce's kind new boyfriend?", "Bob Newby", "Murray Bauman", "Sam Owens", "Lonnie Byers"],
  ["Where does Bob work?", "RadioShack", "Melvald's General Store", "Family Video", "The Hawkins Post"],
  ["Which candy bar does Dart go crazy for?", "3 Musketeers", "Snickers", "Reese's Pieces", "Baby Ruth"],
  ["What message does possessed Will tap out in Morse code?", "CLOSE GATE", "RUN NOW", "HELP ME", "RIGHT HERE"],
  ["What is Eleven's birth name?", "Jane", "Sara", "Kali", "Terry"],
  ["What is the school dance at the end of the season called?", "The Snow Ball", "The Winter Formal", "The Spring Fling", "The Harvest Dance"],
  ["What number is Kali?", "008", "007", "010", "001"]
 ],[
  ["Which Hawkins Middle club did Bob Newby start as a kid?", "The AV Club", "The Chess Club", "The Science Club", "The Hellfire Club"],
  ["Who is the conspiracy-loving investigator hired to look into Barb's disappearance?", "Murray Bauman", "Sam Owens", "Connie Frazier", "Larry Kline"],
  ["For how many days in a row had Mike tried calling Eleven?", "353", "100", "265", "411"],
  ["Which doctor now runs Hawkins Lab after Brenner?", "Dr. Sam Owens", "Dr. Alexei", "Dr. Kay", "Dr. Hatch"],
  ["What is the name of the Hendersons' cat that Dart eats?", "Mews", "Tews", "Whiskers", "Chester"],
  ["Which song plays as Mike and Eleven dance at the Snow Ball?", "Every Breath You Take", "Time After Time", "Africa", "Heroes"],
  ["In which city does Eleven find Kali and her gang?", "Chicago", "Pittsburgh", "Detroit", "Indianapolis"],
  ["Which movie does Bob rent for a night in with Joyce?", "Mr. Mom", "Ghostbusters", "WarGames", "E.T."]
 ]],
 // ================= SEASON 3 =================
 [[
  ["What is the name of Hawkins' shiny new mall?", "Starcourt", "Hawkins Plaza", "Northgate", "Roane Galleria"],
  ["Where does Steve work this summer?", "Scoops Ahoy", "Family Video", "The Gap", "Hawkins Pool"],
  ["Who is Steve's sharp-tongued coworker?", "Robin Buckley", "Heather Holloway", "Vickie", "Chrissy Cunningham"],
  ["Which holiday does the season build toward?", "The Fourth of July", "Halloween", "Labor Day", "Christmas"],
  ["What is the name of Dustin's long-distance girlfriend?", "Suzie", "Stacy", "Tina", "Jennifer"],
  ["Which Sinclair crawls through the vents for the Scoops Troop?", "Erica", "Lucas", "Tina", "Charles"],
  ["In what year is the season set?", "1985", "1983", "1984", "1986"],
  ["What is Billy's summer job?", "Lifeguard", "Mechanic", "Ice cream scooper", "Mall security"]
 ],[
  ["Which song do Dustin and Suzie sing over the radio?", "The NeverEnding Story", "Material Girl", "Take On Me", "Footloose"],
  ["What is the name of the Russian scientist Hopper and Joyce capture?", "Alexei", "Dmitri", "Yuri", "Grigori"],
  ["Which Slurpee flavor does Alexei insist on?", "Cherry", "Strawberry", "Blue raspberry", "Cola"],
  ["What does Dustin name his giant homemade radio tower?", "Cerebro", "Big Bertha", "The Beacon", "Radio Free Hawkins"],
  ["Which camp has Dustin just come home from?", "Camp Know Where", "Camp Crystal Lake", "Camp Hero", "Camp Hoosier"],
  ["Which zombie movie do the kids sneak into at the mall?", "Day of the Dead", "Return of the Living Dead", "Dawn of the Dead", "Fright Night"],
  ["Where do Nancy and Jonathan have summer jobs?", "The Hawkins Post", "Hawkins Lab", "Starcourt Mall", "The mayor's office"],
  ["Who is the corrupt mayor of Hawkins?", "Larry Kline", "Tom Holloway", "Ted Wheeler", "Bruce Lowe"]
 ],[
  ["Which number does Suzie supply to open the Russian vault?", "Planck's constant", "Pi", "Avogadro's number", "The speed of light"],
  ["What nickname does Hopper give Alexei?", "Smirnoff", "Ivan", "Comrade", "Boris"],
  ["Whose fertilizer-eating rats put Nancy on the trail of the story?", "Mrs. Driscoll", "Mrs. Wheeler", "Mrs. Henderson", "Mrs. Holloway"],
  ["At which restaurant does Hopper wait for Joyce, who never shows?", "Enzo's", "Benny's Burgers", "Hawk Diner", "Bradley's Big Buy"],
  ["Which controversial soda does Lucas happily defend?", "New Coke", "Crystal Pepsi", "Tab", "Jolt Cola"],
  ["What is Suzie's pet name for Dustin?", "Dusty-bun", "Dusty-bear", "Toothless", "Curly"],
  ["What does Erica demand in exchange for crawling through the vents?", "Free ice cream for life", "Fifty dollars", "A new bike", "Steve's sailor hat"],
  ["What event is Mayor Kline throwing to keep the town happy?", "The Fun Fair", "The Harvest Festival", "The Snow Ball", "The Grand Parade"]
 ]],
 // ================= SEASON 4 =================
 [[
  ["What name do the kids give this season's villain?", "Vecna", "The Mind Flayer", "Demogorgon", "Tiamat"],
  ["Which Kate Bush song saves Max?", "Running Up That Hill", "Wuthering Heights", "Cloudbusting", "Babooshka"],
  ["What is the Hawkins High D&D club called?", "The Hellfire Club", "The Dragon Guild", "The Party", "The AV Club"],
  ["Who leads the Hellfire Club?", "Eddie Munson", "Jason Carver", "Gareth", "Mike Wheeler"],
  ["In which country is Hopper being held prisoner?", "The Soviet Union", "China", "East Germany", "Cuba"],
  ["Which state have Joyce, Will, Jonathan and Eleven moved to?", "California", "Florida", "Texas", "Nevada"],
  ["Who is Jonathan's laid-back pizza-delivering best friend?", "Argyle", "Eddie", "Fred", "Yuri"],
  ["Which sport has Lucas joined a team for?", "Basketball", "Baseball", "Football", "Track"]
 ],[
  ["What is the name of the pizza place Argyle works for?", "Surfer Boy Pizza", "Enzo's Pizza", "Palace Pizza", "Hawk Slice"],
  ["What is the Byers' new hometown called?", "Lenora Hills", "Santa Mira", "Sunnydale", "Hill Valley"],
  ["Who is Vecna's first victim this season?", "Chrissy Cunningham", "Fred Benson", "Patrick McKinney", "Heather Holloway"],
  ["Which Metallica song does Eddie play in the Upside Down?", "Master of Puppets", "Enter Sandman", "Ride the Lightning", "One"],
  ["What was Vecna's name when he was human?", "Henry Creel", "Victor Creel", "Peter Ballard", "Martin Brenner"],
  ["What is the name of the roller rink in California?", "Rink-O-Mania", "Skate City", "Roller Palace", "Wheel Zone"],
  ["What is Hawkins High's team mascot?", "Tigers", "Hawks", "Wildcats", "Bulldogs"],
  ["Which nickname does the prison guard Dmitri go by?", "Enzo", "Bald Eagle", "Katinka", "American"]
 ],[
  ["Who is the peanut-butter-smuggling pilot who betrays Joyce and Murray?", "Yuri", "Dmitri", "Ivan", "Oleg"],
  ["In which hospital is Victor Creel locked away?", "Pennhurst", "Hawkins Memorial", "Arkham", "Briarcliff"],
  ["What number was Henry Creel in the lab?", "001", "000", "010", "012"],
  ["What do the kids nickname the gate at the bottom of Lover's Lake?", "Watergate", "Lakegate", "Floodgate", "Deep Gate"],
  ["Which city does the gang travel to for Suzie's help?", "Salt Lake City", "Las Vegas", "Denver", "Boise"],
  ["What is the secret project to restore Eleven's powers called?", "The Nina Project", "Project Rainbow", "The Jane Project", "Project Indigo"],
  ["How many gates does Vecna need to open?", "Four", "Three", "Seven", "Eleven"],
  ["Who is the guidance counselor that Vecna's victims were all visiting?", "Ms. Kelley", "Mr. Clarke", "Mrs. Click", "Ms. O'Donnell"]
 ]],
 // ================= SEASON 5 =================
 [[
  ["What are the call letters of the radio station the gang works from?", "WSQK", "WKRP", "WHWK", "KHAW"],
  ["Which Wheeler is taken into the Upside Down?", "Holly", "Nancy", "Mike", "Ted"],
  ["In what year is the final season set?", "1987", "1986", "1988", "1989"],
  ["Which member of the party is in a coma as the season opens?", "Max", "Lucas", "Dustin", "Erica"],
  ["What has the military done to Hawkins?", "Put it under quarantine", "Evacuated it", "Flooded it", "Renamed it"],
  ["Who delivers the final blow to Vecna?", "Joyce", "Eleven", "Hopper", "Nancy"],
  ["What is the title of the series finale?", "The Rightside Up", "The Last Campaign", "The Gate", "The Final Roll"],
  ["Which of Eleven's 'sisters' returns this season?", "Kali (Eight)", "Nina", "Ten", "Terry"]
 ],[
  ["What is the name of Holly's 'imaginary friend'?", "Mr. Whatsit", "Mr. Sandman", "Mr. Clock", "Mr. Nobody"],
  ["Who leads the military operation in Hawkins?", "Dr. Kay", "Dr. Owens", "Colonel Sullivan", "Dr. Brenner"],
  ["Which kid, Holly's bully, does the gang use as bait?", "Derek Turnbow", "Troy Walsh", "Jason Carver", "Danny Sinclair"],
  ["What does Holly call the prison inside Vecna's mind?", "Camazotz", "Mirkwood", "Narnia", "Mordor"],
  ["Who discovers powers of his own in the episode 'Sorcerer'?", "Will", "Mike", "Dustin", "Jonathan"],
  ["What is the title of the season's first episode?", "The Crawl", "The Quarantine", "The Squawk", "The Wall"],
  ["Who blows up a laundry machine to save the kids at the hospital?", "Karen Wheeler", "Joyce Byers", "Claudia Henderson", "Sue Sinclair"],
  ["Who stays by Max's side while she is in her coma?", "Lucas", "Billy", "Steve", "Mike"]
 ],[
  ["Which classic novel gives Camazotz and Mr. Whatsit their names?", "A Wrinkle in Time", "The Hobbit", "The Lion, the Witch and the Wardrobe", "Watership Down"],
  ["According to Dustin, what holds the Upside Down together?", "Exotic matter", "Dark energy", "Red lightning", "The hive mind"],
  ["The Upside Down turns out to be a bridge to what place?", "The Abyss", "The Void", "The Shadowfell", "The Nether"],
  ["Who is Dr. Kay's lieutenant?", "Akers", "Sullivan", "Ellen", "Powell"],
  ["How long after the final battle is the epilogue set?", "18 months", "One week", "Five years", "Six months"],
  ["Who helps Lucas and Robin protect Max at the hospital?", "Vickie", "Suzie", "Argyle", "Eden"],
  ["What do the heroes climb to reach the Abyss?", "The WSQK radio tower", "The Hawkins water tower", "Weathertop", "The lab's elevator shaft"],
  ["Which filmmaker directed 'The Turnbow Trap'?", "Frank Darabont", "Steven Spielberg", "John Carpenter", "Sam Raimi"]
 ]]
];
