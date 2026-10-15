# Record Your Exhibit Narration

Record one MP3 per exhibit. Read the passage, evidence, and question below. Upload your MP3s into assets/narration/ in GitHub. Filenames are lowercase and must match exactly.

In config.js, set each exhibitNarration value to its file path. Example:

```js
radio: "assets/narration/radio.mp3",
```

Set useDeviceNarration: false to turn off the device voice everywhere. Exhibits with a recording will play it; unrecorded exhibits remain readable with their Listen button disabled. Leave true to retain the device voice only for missing recordings.

The in-game Listen To Label button plays the matching recording. Stop Narration or closing the exhibit stops it. Background music becomes quieter during narration.

## On the Air

### A nation tunes in

File: `assets/narration/radio.mp3`

Config entry: `radio: "assets/narration/radio.mp3",`

In November 1920, Pittsburgh station KDKA broadcast presidential election returns. During the decade, radio brought music, news, and sport into homes. NBC began in 1926, connecting stations into a network. Listeners in distant places could follow the same programs; a local event could become a national conversation. Advertisers helped pay for broadcasting and shaped what audiences heard.

The Evidence: The 1925 report The merchandising of radio discusses farm listeners as a market. Its commercial purpose matters: it tells us how publishers imagined buyers, not what every family actually heard.

Think About It: How could one program create a shared culture among people who never met?

### Time for something new

File: `assets/narration/leisure.mp3`

Config entry: `leisure: "assets/narration/leisure.mp3",`

More leisure for some workers and middle-class families created audiences for movies, radio, and recreation. Appliances could reduce particular household tasks where families could afford them and obtain electricity. Technology supplied new entertainment while available time and spending money helped turn it into a mass market. Access was uneven: long hours, poverty, and domestic labor did not simply disappear.

The Evidence: A consumer-history account describes washing machines, vacuum cleaners, and installment buying. Read this as evidence of expanding possibilities, not proof that all Americans enjoyed the same comfort.

Think About It: Why did an invention need affordable access AND leisure time to transform culture?

### Culture goes commercial

File: `assets/narration/advert.mp3`

Config entry: `advert: "assets/narration/advert.mp3",`

Advertising linked products to an attractive modern identity. Radios, cars, and entertainment were sold as ways to belong. Installment plans let households buy goods before paying the full price, but created obligations for the future. Shared culture could connect people while also encouraging them to measure success through consumption.

The Evidence: Curator interpretation: cultural enthusiasm and buying on credit help explain the era’s consumer outlook, but jazz or flapper fashion did not cause the Great Depression. Its economic causes were broader and more complex.

Think About It: Does an advertisement reveal how people lived, or how a seller wanted them to live?

## New Rules

### A vote—and its limits

File: `assets/narration/vote.mp3`

Config entry: `vote: "assets/narration/vote.mp3",`

Ratified in 1920, the Nineteenth Amendment prohibited denying the vote on account of sex. It followed decades of organizing, not a sudden gift of freedom. Discriminatory laws and practices still prevented many women from voting, especially Black women in the South. Citizenship restrictions also excluded many people. A legal change could enlarge freedom while leaving other barriers intact.

The Evidence: The amendment’s language focuses on discrimination by sex. Pair that text with the National Archives’ discussion of continuing exclusion: a constitutional promise and access in practice are different kinds of evidence.

Think About It: Which freedoms changed in 1920, and which obstacles did this amendment leave unresolved?

### The flapper in the frame

File: `assets/narration/flapper.mp3`

Config entry: `flapper: "assets/narration/flapper.mp3",`

Bobbed hair, shorter skirts, dancing, and public independence made the flapper a striking symbol of changing expectations. This image was especially associated with youthful urban culture. It did not describe all women, and clothing alone did not remove unequal pay, racial discrimination, or expectations about marriage and housework.

The Evidence: In Charleston at the Capitol, Ruth Bennett and Sylvia Clavins dance on a railing beside a congressman. The public setting suggests visibility and performance. A posed photograph cannot tell us how typical their behavior was.

Think About It: What can you observe in this photograph? What claim would require more evidence?

### Independence was uneven

File: `assets/narration/work.mp3`

Config entry: `work: "assets/narration/work.mp3",`

Wartime service and work made women’s contributions more visible, but postwar life did not bring full equality. Paid employment, education, and public participation could expand possibilities while conventional gender roles persisted. Some women embraced new styles; many others combined older expectations with new opportunities. Race, class, age, and place shaped those choices.

The Evidence: Compare the newspaper flapper image with voting-rights evidence. A fashionable symbol can reveal changing ideals without representing the circumstances of most women.

Think About It: Why is “all women became liberated in the 1920s” an unreliable conclusion?

## A World Remade

### The Lost Generation

File: `assets/narration/lost.mp3`

Config entry: `lost: "assets/narration/lost.mp3",`

Ernest Hemingway’s The Sun Also Rises follows American and British expatriates in Europe after World War I. Their travel and social lives coexist with injury, emotional strain, and a lack of purpose. The novel offers a way to interpret postwar disillusionment: surviving a modern war could undermine faith in traditional ideals.

The Evidence: The Library of Congress identifies the novel with the war’s “Lost Generation.” A fictional work is primary evidence of literary expression, not a statistical portrait of every veteran.

Think About It: Why might a story about leisure and travel still express the damage of war?

### Behind the glitter

File: `assets/narration/gatsby.mp3`

Config entry: `gatsby: "assets/narration/gatsby.mp3",`

F. Scott Fitzgerald’s The Great Gatsby places wealth, parties, and longing beside exclusion and disappointment. Its symbolism and carefully filtered narration invite readers to question the promise of success. Curator interpretation: the contrast between glamour and emptiness complicates a simple story of an entirely carefree decade.

The Evidence: Read the novel as a crafted viewpoint. Ask whose experiences appear, whose are absent, and how the narrator shapes our judgment of wealth.

Think About It: How can a writer criticize a culture by depicting its most attractive features?

### Breaking the old frame

File: `assets/narration/dada.mp3`

Config entry: `dada: "assets/narration/dada.mp3",`

Modernism was a broad search for new forms, not one uniform style. Dada artists used collage, chance, and unexpected combinations to challenge conventional ideas about art and order. Many criticized the social structures that had helped produce World War I. Experimental art could express doubt about the supposedly rational civilization that had made mass destruction possible.

The Evidence: MoMA connects Dada experimentation to criticism of wartime society. The Met’s war-art exhibition shows varied responses, reminding us that not every modern artist expressed the same politics or feelings. The museum’s small art icon is a modern illustration, not an original Dada work.

Think About It: How might a fractured or unexpected image communicate disillusionment?

## Two Americas

### The urban turning point

File: `assets/narration/city.mp3`

Config entry: `city: "assets/narration/city.mp3",`

The 1920 census was the first to classify more than half of the U.S. population as urban. At that time, the urban category included places of at least 2,500 people; it did not mean that most Americans lived in giant cities. Cities concentrated theaters, clubs, shops, and audiences, helping new fashions and entertainment circulate.

The Evidence: The meaning of a statistic depends on its definition. Using today’s idea of “urban” to interpret a 1920 census category could produce a misleading conclusion.

Think About It: Why must a historian check what “urban” meant before interpreting the number?

### Rural does not mean isolated

File: `assets/narration/rural.mp3`

Config entry: `rural: "assets/narration/rural.mp3",`

Country life often organized work and sociability around farms, churches, fairs, and local gatherings; city life offered denser concentrations of commercial entertainment. But the divide was not absolute. Farm households could listen to broadcasts and travel by car, while many city residents defended traditional values. Income, roads, and access to technology affected participation.

The Evidence: The 1925 merchandising report treats farm families as a radio audience. That is direct evidence that advertisers saw a rural market, though it does not prove universal ownership.

Think About It: How could people share a radio program while living very different lives?

### A wider weekend

File: `assets/narration/road.mp3`

Config entry: `road: "assets/narration/road.mp3",`

Automobiles widened the possible distance between home and recreation. A drive could connect a rural household with a town’s theater or bring city residents to the countryside. Mobility changed courtship and leisure as well as work. Car ownership, fuel, and usable roads still required resources, so new freedoms were not distributed equally.

The Evidence: Compare transportation with broadcasting: cars moved people toward experiences, while radio brought an experience into the home.

Think About It: Which would matter more to a remote household: access to a car or access to a radio? Defend your answer with evidence.

## All That Jazz

### The record carries the sound

File: `assets/narration/jazzrecord.mp3`

Config entry: `jazzrecord: "assets/narration/jazzrecord.mp3",`

Jazz and blues grew from African American musical traditions. Commercial records helped performances travel beyond a single venue. Mamie Smith’s Crazy Blues (1920), Bessie Smith’s Down-Hearted Blues (1923), and Louis Armstrong’s Hot Five and Hot Seven recordings (1925–1928) demonstrate the decade’s musical creativity. Popular influence did not erase racial exclusion in the entertainment industry.

The Evidence: Listen to a period record and notice instruments, rhythm, and recording quality. The linked 1920 recording is by a white band; its commercial visibility must not be mistaken for evidence that white musicians invented jazz.

Think About It: What can a sound recording reveal that a written description cannot?

### A cultural crossroads

File: `assets/narration/harlem.mp3`

Config entry: `harlem: "assets/narration/harlem.mp3",`

The Great Migration, accelerated by wartime job opportunities and the effort to escape Southern racism, helped expand Black urban communities. Harlem became a major center of writing, music, and artistic expression. Black creators asserted identity and challenged stereotypes even as segregation and unequal opportunity persisted. This cultural movement belongs within the national story of the decade.

The Evidence: Movement of people helped move cultural practices. The connection is not “war invented jazz,” but that wartime migration helped reshape the places where artists and audiences met.

Think About It: How could migration influence culture without eliminating discrimination?

### Learning the latest steps

File: `assets/narration/dance.mp3`

Config entry: `dance: "assets/narration/dance.mp3",`

Dance floors made popular culture something people could do together. The Charleston became associated with youthful change and the flapper image. Newspapers, performances, records, and films circulated new fashions. The same activity could feel liberating to one person and troubling to another, revealing conflict over age, gender, and respectability.

The Evidence: Pair the Capitol dance photograph with a newspaper account in the flapper guide. Compare an image designed to attract attention with text that may praise or criticize the trend.

Think About It: Why might disagreement about a dance reveal a larger disagreement about freedom?

## In the Spotlight

### The making of a sports hero

File: `assets/narration/sport.mp3`

Config entry: `sport: "assets/narration/sport.mp3",`

Babe Ruth in baseball, Jack Dempsey in boxing, and other celebrated athletes became familiar far beyond their immediate audiences. Newspapers and radio helped people follow games and recognize stars. Spectator sports offered a shared language of records and rivalries. Public attention, however, did not mean every athlete had equal access to professional competition.

The Evidence: The Smithsonian preserves sports equipment and signed objects. An object can document a player or sport; wider claims about fame require additional evidence such as press coverage and broadcasts.

Think About It: How did mass media change the scale of sporting celebrity?

### An evening at the pictures

File: `assets/narration/cinema.mp3`

Config entry: `cinema: "assets/narration/cinema.mp3",`

Movies helped distant audiences encounter the same stories, stars, and fashions. Clara Bow became a famous screen personality. The Jazz Singer (1927) was a landmark in the commercial transition to synchronized speech and song, rather than the first film ever made with sound. Its blackface performance also exposes racism within mainstream entertainment; technological novelty is not the same as social progress.

The Evidence: The Smithsonian’s 1927 collection feature places films beside other popular objects. Curator interpretation: study media both as an innovation and as a carrier of the prejudices of its time.

Think About It: Can a film be historically influential and still deserve criticism?

### Leisure through a private lens

File: `assets/narration/homefilm.mp3`

Config entry: `homefilm: "assets/narration/homefilm.mp3",`

Ira Gershwin’s surviving home movies include New York Harbor, Palm Beach, and Miami Beach. They offer moving evidence of travel and recreation near the end of the decade. A private camera records a particular person’s access and interests. Affluent vacation scenes should not be treated as a picture of everyone’s experience.

The Evidence: The Library of Congress catalog gives an uncertain date range, approximately 1928–1930. Preserve that uncertainty when citing the footage. Look for transport, clothing, and the selection of places filmed.

Think About It: Whose leisure is visible in this film, and whose daily life is missing?

