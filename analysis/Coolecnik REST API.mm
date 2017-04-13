<map version="freeplane 1.5.9">
<!--To view this file, download free mind mapping software Freeplane from http://freeplane.sourceforge.net -->
<node TEXT="Coolecnik REST API" FOLDED="false" ID="ID_1387381223" CREATED="1490338875762" MODIFIED="1490338883995" STYLE="oval">
<font SIZE="18"/>
<hook NAME="MapStyle" zoom="2.143">
    <properties fit_to_viewport="false;"/>

<map_styles>
<stylenode LOCALIZED_TEXT="styles.root_node" STYLE="oval" UNIFORM_SHAPE="true" VGAP_QUANTITY="24.0 pt">
<font SIZE="24"/>
<stylenode LOCALIZED_TEXT="styles.predefined" POSITION="right" STYLE="bubble">
<stylenode LOCALIZED_TEXT="default" COLOR="#000000" STYLE="fork">
<font NAME="SansSerif" SIZE="10" BOLD="false" ITALIC="false"/>
</stylenode>
<stylenode LOCALIZED_TEXT="defaultstyle.details"/>
<stylenode LOCALIZED_TEXT="defaultstyle.attributes">
<font SIZE="9"/>
</stylenode>
<stylenode LOCALIZED_TEXT="defaultstyle.note" COLOR="#000000" BACKGROUND_COLOR="#ffffff" TEXT_ALIGN="LEFT"/>
<stylenode LOCALIZED_TEXT="defaultstyle.floating">
<edge STYLE="hide_edge"/>
<cloud COLOR="#f0f0f0" SHAPE="ROUND_RECT"/>
</stylenode>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.user-defined" POSITION="right" STYLE="bubble">
<stylenode LOCALIZED_TEXT="styles.topic" COLOR="#18898b" STYLE="fork">
<font NAME="Liberation Sans" SIZE="10" BOLD="true"/>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.subtopic" COLOR="#cc3300" STYLE="fork">
<font NAME="Liberation Sans" SIZE="10" BOLD="true"/>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.subsubtopic" COLOR="#669900">
<font NAME="Liberation Sans" SIZE="10" BOLD="true"/>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.important">
<icon BUILTIN="yes"/>
</stylenode>
</stylenode>
<stylenode LOCALIZED_TEXT="styles.AutomaticLayout" POSITION="right" STYLE="bubble">
<stylenode LOCALIZED_TEXT="AutomaticLayout.level.root" COLOR="#000000" STYLE="oval" SHAPE_HORIZONTAL_MARGIN="10.0 pt" SHAPE_VERTICAL_MARGIN="10.0 pt">
<font SIZE="18"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,1" COLOR="#0033ff">
<font SIZE="16"/>
<edge COLOR="#ff0000"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,2" COLOR="#00b439">
<font SIZE="14"/>
<edge COLOR="#0000ff"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,3" COLOR="#990000">
<font SIZE="12"/>
<edge COLOR="#00ff00"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,4" COLOR="#111111">
<font SIZE="10"/>
<edge COLOR="#ff00ff"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,5">
<edge COLOR="#00ffff"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,6">
<edge COLOR="#7c0000"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,7">
<edge COLOR="#00007c"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,8">
<edge COLOR="#007c00"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,9">
<edge COLOR="#7c007c"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,10">
<edge COLOR="#007c7c"/>
</stylenode>
<stylenode LOCALIZED_TEXT="AutomaticLayout.level,11">
<edge COLOR="#7c7c00"/>
</stylenode>
</stylenode>
</stylenode>
</map_styles>
</hook>
<hook NAME="AutomaticEdgeColor" COUNTER="8" RULE="ON_BRANCH_CREATION"/>
<node TEXT="functionality" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" POSITION="right" ID="ID_204372916" CREATED="1490339000619" MODIFIED="1490340565218">
<node TEXT="player" FOLDED="true" ID="ID_1714492214" CREATED="1492076708018" MODIFIED="1492076713201">
<node TEXT="add a friend" ID="ID_88294519" CREATED="1491946348814" MODIFIED="1491946362147" LINK="#ID_1936842614"/>
<node TEXT="remove a friend" ID="ID_151539905" CREATED="1491946568278" MODIFIED="1491946582593" LINK="#ID_1851693545"/>
<node TEXT="login" ID="ID_361722778" CREATED="1490338943946" MODIFIED="1490343402007" LINK="#ID_656188260"/>
<node TEXT="registration" ID="ID_439902513" CREATED="1490338952202" MODIFIED="1490343416383" LINK="#ID_1838319806"/>
<node TEXT="reset password" ID="ID_1440106549" CREATED="1490730634336" MODIFIED="1490730656624" LINK="#ID_1612113672"/>
<node TEXT="update password" ID="ID_1477137077" CREATED="1490898954541" MODIFIED="1490898966904" LINK="#ID_1472921065"/>
</node>
<node TEXT="game" FOLDED="true" ID="ID_1819064192" CREATED="1492076754192" MODIFIED="1492076755373">
<node TEXT="end game" ID="ID_1912113215" CREATED="1491729396685" MODIFIED="1491729915051" LINK="#ID_769937977"/>
<node TEXT="create new game" ID="ID_1332294221" CREATED="1490898911508" MODIFIED="1490898944599" LINK="#ID_1206525773"/>
<node TEXT="create new game type" ID="ID_682704610" CREATED="1490898901764" MODIFIED="1490898925849" LINK="#ID_1582186992"/>
</node>
<node TEXT="strike" FOLDED="true" ID="ID_332650716" CREATED="1492076767374" MODIFIED="1492076769131">
<node TEXT="add strikes" ID="ID_952272187" CREATED="1490898911508" MODIFIED="1490974191352" LINK="#ID_486238382"/>
<node TEXT="create new strike type" ID="ID_1037871574" CREATED="1490971710589" MODIFIED="1490971723595" LINK="#ID_71683048"/>
</node>
</node>
<node TEXT="endpoints" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" POSITION="right" ID="ID_598258874" CREATED="1490339036906" MODIFIED="1490340558307">
<node TEXT="/api" FOLDED="true" ID="ID_1702402510" CREATED="1492076459204" MODIFIED="1492076462679">
<node TEXT="/register" FOLDED="true" ID="ID_1838319806" CREATED="1490339047850" MODIFIED="1492076596873">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1153028670" CREATED="1490339093794" MODIFIED="1490340644196">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_460586185" CREATED="1490339110938" MODIFIED="1490340646370">
<node TEXT="POST" ID="ID_314272529" CREATED="1490339138114" MODIFIED="1490389100408"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1428252452" CREATED="1490339128682" MODIFIED="1490340646668">
<node TEXT="application/json" ID="ID_931790850" CREATED="1490339854082" MODIFIED="1490339859181"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_750411406" CREATED="1490339115410" MODIFIED="1490340646964">
<node TEXT="{&#xa;  &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;  &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json&quot;,&#xa;  &quot;properties&quot;: {&#xa;    &quot;login&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/login&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;email&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/email&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;passwordHash&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/passwordHash&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;firstName&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/firstName&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;lastName&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/lastName&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    }&#xa;  },&#xa;  &quot;required&quot;: [&#xa;    &quot;login&quot;,&#xa;    &quot;passwordHash&quot;,&#xa;    &quot;email&quot;&#xa;  ],&#xa;  &quot;type&quot;: &quot;object&quot;&#xa;}" ID="ID_968274784" CREATED="1490339301882" MODIFIED="1490339844458"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_261834132" CREATED="1490339119666" MODIFIED="1490340647196">
<node TEXT="{&#xa;  &quot;login&quot;: &quot;user1&quot;,&#xa;  &quot;email&quot;: &quot;user1@coolecnik.com&quot;,&#xa;  &quot;passwordHash&quot;: &quot;@w3s0m3_p4ssw0rd&quot;,&#xa;  &quot;firstName&quot;: &quot;User&quot;,&#xa;  &quot;lastName&quot;: &quot;Smith&quot;&#xa;}" ID="ID_56729443" CREATED="1490339360474" MODIFIED="1490339407446"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1217366163" CREATED="1490339105938" MODIFIED="1490340644996">
<node TEXT="registered succesfully" FOLDED="true" ID="ID_1132713315" CREATED="1490339865890" MODIFIED="1490340086987">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_603410566" CREATED="1490339886618" MODIFIED="1490340529009">
<node TEXT="201 CREATED" ID="ID_1396597569" CREATED="1490340088426" MODIFIED="1490340091502"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_546970634" CREATED="1490340031618" MODIFIED="1490340533137">
<node TEXT="Created user as a JSON" FOLDED="true" ID="ID_838583552" CREATED="1490340276338" MODIFIED="1490340293437">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_357099164" CREATED="1490340294145" MODIFIED="1490733252056">
<node TEXT="{&#xa;  &quot;id&quot;: 123,&#xa;  &quot;login&quot;: &quot;user1&quot;,&#xa;  &quot;email&quot;: &quot;user1@coolecnik.com&quot;,&#xa;  &quot;passwordHash&quot;: &quot;@w3s0m3_p4ssw0rd&quot;,&#xa;  &quot;firstName&quot;: &quot;User&quot;,&#xa;  &quot;lastName&quot;: &quot;Smith&quot;&#xa;}" ID="ID_1487176458" CREATED="1490340036506" MODIFIED="1490340046902"/>
</node>
</node>
</node>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_1880397629" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_889778342" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_925040034" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_492748471" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_1142190608" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
<node TEXT="can&apos;t insert user into DB" FOLDED="true" ID="ID_1496843522" CREATED="1490340112410" MODIFIED="1490340120004">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_182565917" CREATED="1490340050658" MODIFIED="1490340568782">
<node TEXT="406 NOT ACCEPTABLE" ID="ID_761041122" CREATED="1490340380722" MODIFIED="1490340384492"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1835796700" CREATED="1490340058722" MODIFIED="1490340572641">
<node TEXT="message from DB exception" FOLDED="true" ID="ID_1808245669" CREATED="1490340326210" MODIFIED="1490340337739">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_72808023" CREATED="1490340364562" MODIFIED="1490875957688">
<node TEXT="Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections." ID="ID_1423474431" CREATED="1490340367610" MODIFIED="1490340378085"/>
<node TEXT="ERROR: duplicate key value violates unique constraint &quot;players_email_idx&quot;&#xa;  Detail: Key (email)=(l23&#x430;&#x43f;&#x432;&#x430;4563) already exists." ID="ID_1041691457" CREATED="1490340394466" MODIFIED="1490340395414"/>
</node>
</node>
</node>
</node>
</node>
</node>
<node TEXT="/login" FOLDED="true" ID="ID_656188260" CREATED="1490339056282" MODIFIED="1492076599686">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_582743712" CREATED="1490339093794" MODIFIED="1490340644196">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" ID="ID_1609172563" CREATED="1490339110938" MODIFIED="1490340646370">
<node TEXT="POST" ID="ID_1954440184" CREATED="1490339138114" MODIFIED="1490389110399"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" ID="ID_762647841" CREATED="1490339128682" MODIFIED="1490340646668">
<node TEXT="application/json" ID="ID_320405408" CREATED="1490339854082" MODIFIED="1490339859181"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1909823858" CREATED="1490339115410" MODIFIED="1490340646964">
<node TEXT="{&#xa;  &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;  &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/login.json&quot;,&#xa;  &quot;properties&quot;: {&#xa;    &quot;login&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/login.json/login&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;passwordHash&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/login.json/passwordHash&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    }&#xa;  },&#xa;  &quot;required&quot;: [&#xa;    &quot;login&quot;,&#xa;    &quot;passwordHash&quot;&#xa;  ],&#xa;  &quot;type&quot;: &quot;object&quot;&#xa;}" ID="ID_1620114458" CREATED="1490339301882" MODIFIED="1490398725264"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1469875075" CREATED="1490339119666" MODIFIED="1490340647196">
<node TEXT="{&#xa;  &quot;login&quot;: &quot;user1&quot;,&#xa;  &quot;passwordHash&quot;: &quot;@w3s0m3_p4ssw0rd&quot;&#xa;}" ID="ID_765399102" CREATED="1490339360474" MODIFIED="1490398735748"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_363948555" CREATED="1490339105938" MODIFIED="1490340644996">
<node TEXT="registered succesfully" FOLDED="true" ID="ID_1638230469" CREATED="1490339865890" MODIFIED="1490340086987">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1451528939" CREATED="1490339886618" MODIFIED="1490340529009">
<node TEXT="202 ACCEPTED" ID="ID_1798796570" CREATED="1490340088426" MODIFIED="1490398548924"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_75597941" CREATED="1490340031618" MODIFIED="1490340533137">
<node TEXT="User as a JSON" ID="ID_1836523156" CREATED="1490340276338" MODIFIED="1491505135145">
<node TEXT="example" ID="ID_1550389192" CREATED="1490340294145" MODIFIED="1490340296733">
<node TEXT="{&#xa;  &quot;id&quot;: 123,&#xa;  &quot;login&quot;: &quot;user1&quot;,&#xa;  &quot;email&quot;: &quot;user1@coolecnik.com&quot;,&#xa;  &quot;passwordHash&quot;: &quot;@w3s0m3_p4ssw0rd&quot;,&#xa;  &quot;firstName&quot;: &quot;User&quot;,&#xa;  &quot;lastName&quot;: &quot;Smith&quot;&#xa;}" ID="ID_367960377" CREATED="1490340036506" MODIFIED="1490340046902"/>
</node>
</node>
</node>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_1875694184" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" ID="ID_1824011381" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_1313723345" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1786461221" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_573080437" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
<node TEXT="bad credentials" FOLDED="true" ID="ID_1992527257" CREATED="1490340112410" MODIFIED="1490398575373">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" ID="ID_111266835" CREATED="1490340050658" MODIFIED="1490340568782">
<node TEXT="401 UNAUTHORIZED" ID="ID_743223346" CREATED="1490340380722" MODIFIED="1490398583565"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" ID="ID_1575207300" CREATED="1490340058722" MODIFIED="1490340572641">
<node TEXT="Bad credentials" ID="ID_1666045170" CREATED="1490398589318" MODIFIED="1490398602376"/>
</node>
</node>
</node>
</node>
<node TEXT="/players" FOLDED="true" ID="ID_794403110" CREATED="1492076482179" MODIFIED="1492076484214">
<node TEXT="/$idWho/unfriend/$idWhom" FOLDED="true" ID="ID_1851693545" CREATED="1491946364157" MODIFIED="1492076527509">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_137957055" CREATED="1491946383230" MODIFIED="1491946391011">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_977459427" CREATED="1491946392534" MODIFIED="1491946412610">
<node TEXT="DELETE" ID="ID_1350393575" CREATED="1491946397710" MODIFIED="1491946416083"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_389591573" CREATED="1491946386998" MODIFIED="1491946391304">
<node TEXT="success" FOLDED="true" ID="ID_989513195" CREATED="1491946418638" MODIFIED="1491946429600">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_583390750" CREATED="1491946430302" MODIFIED="1491946445301">
<node TEXT="204 NO CONTENT" ID="ID_1489350006" CREATED="1491946445934" MODIFIED="1491946449552"/>
</node>
</node>
<node TEXT="no such friendship" FOLDED="true" ID="ID_760297524" CREATED="1491946454575" MODIFIED="1491946465505">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1518630792" CREATED="1491946466550" MODIFIED="1491946475188">
<node TEXT="404 NOT FOUND" ID="ID_1152778171" CREATED="1491946469862" MODIFIED="1491946472704"/>
</node>
</node>
</node>
</node>
<node TEXT="/$idWho/befriend/$idWhom" FOLDED="true" ID="ID_1936842614" CREATED="1491944616790" MODIFIED="1492076533222">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_544278379" CREATED="1491944633246" MODIFIED="1491944644600">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_151536737" CREATED="1491944837894" MODIFIED="1491946407404">
<node TEXT="POST" ID="ID_652445849" CREATED="1491944846078" MODIFIED="1491944848873"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_981806172" CREATED="1491944646422" MODIFIED="1491944653652">
<node TEXT="success" FOLDED="true" ID="ID_499210084" CREATED="1491944731150" MODIFIED="1491944733058">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1342289553" CREATED="1491944753246" MODIFIED="1491944772579">
<node TEXT="200 OK" ID="ID_564361477" CREATED="1491944760606" MODIFIED="1491944763008"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_94774330" CREATED="1491944769926" MODIFIED="1491944772791">
<node TEXT="friendlist for the player" FOLDED="true" ID="ID_1007330012" CREATED="1491944773798" MODIFIED="1491944785690">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1836867081" CREATED="1491944786718" MODIFIED="1491944789057">
<node TEXT="[{&quot;playerId&quot;:3,&quot;friendId&quot;:1}]" ID="ID_1065580637" CREATED="1491944789798" MODIFIED="1491944801201"/>
</node>
</node>
</node>
</node>
<node TEXT="player not found" FOLDED="true" ID="ID_601283474" CREATED="1491944733774" MODIFIED="1491944740875">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_859425025" CREATED="1491944807678" MODIFIED="1491944818283">
<node TEXT="404 NOT FOUND" ID="ID_387815664" CREATED="1491944811718" MODIFIED="1491944816688"/>
</node>
</node>
<node TEXT="db exception (already friends)" FOLDED="true" ID="ID_525852970" CREATED="1491944741493" MODIFIED="1491944751218">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_815585542" CREATED="1491944820814" MODIFIED="1491944833562">
<node TEXT="409 CONFLICT" ID="ID_1111265506" CREATED="1491944823806" MODIFIED="1491944829249"/>
</node>
</node>
</node>
</node>
<node TEXT="/$id/statistics" FOLDED="true" ID="ID_783291119" CREATED="1492076868960" MODIFIED="1492076883620">
<node TEXT="/basicGames" FOLDED="true" ID="ID_1698222415" CREATED="1492076884855" MODIFIED="1492077449140">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1561341896" CREATED="1492076954404" MODIFIED="1492076961213">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_353894248" CREATED="1492076966327" MODIFIED="1492076970569">
<node TEXT="GET" ID="ID_1958575413" CREATED="1492076971613" MODIFIED="1492076973619"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_196784545" CREATED="1492076957777" MODIFIED="1492076962841">
<node TEXT="player not found or has no games" FOLDED="true" ID="ID_1043159809" CREATED="1492077014856" MODIFIED="1492077077544">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1474864306" CREATED="1492077079034" MODIFIED="1492077138749">
<node TEXT="404 NOT FOUND" ID="ID_1137512639" CREATED="1492077097768" MODIFIED="1492077103929"/>
</node>
</node>
<node TEXT="success" FOLDED="true" ID="ID_262087306" CREATED="1492077965946" MODIFIED="1492077972714">
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1031576930" CREATED="1492077086489" MODIFIED="1492077171482">
<node TEXT="basic game stats JSON object" FOLDED="true" ID="ID_707624516" CREATED="1492077172763" MODIFIED="1492077204025">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_354348263" CREATED="1492077205420" MODIFIED="1492077454559">
<node TEXT="{&quot;total&quot;:2,&quot;won&quot;:0,&quot;draws&quot;:0,&quot;lost&quot;:2,&quot;totalSecs&quot;:71}" ID="ID_611617951" CREATED="1492077954028" MODIFIED="1492077954820"/>
</node>
</node>
</node>
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1493958804" CREATED="1492077981732" MODIFIED="1492077991968">
<node TEXT="200 OK" ID="ID_1831112358" CREATED="1492077993128" MODIFIED="1492077996346"/>
</node>
</node>
</node>
</node>
<node TEXT="/basic8Pool" FOLDED="true" ID="ID_1812753330" CREATED="1492076890850" MODIFIED="1492076895225">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1573312210" CREATED="1492076954404" MODIFIED="1492076961213">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_250071988" CREATED="1492076966327" MODIFIED="1492076970569">
<node TEXT="GET" ID="ID_1602723136" CREATED="1492076971613" MODIFIED="1492076973619"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1059152607" CREATED="1492076957777" MODIFIED="1492076962841">
<node TEXT="player not found or has no 8pool strikes" FOLDED="true" ID="ID_485945192" CREATED="1492077014856" MODIFIED="1492079340055">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1299541548" CREATED="1492077079034" MODIFIED="1492077138749">
<node TEXT="404 NOT FOUND" ID="ID_1528655273" CREATED="1492077097768" MODIFIED="1492077103929"/>
</node>
</node>
<node TEXT="success" FOLDED="true" ID="ID_1873321394" CREATED="1492077965946" MODIFIED="1492077972714">
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1722856407" CREATED="1492077086489" MODIFIED="1492077171482">
<node TEXT="ratio" FOLDED="true" ID="ID_1087833672" CREATED="1492077172763" MODIFIED="1492079325594">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_186933728" CREATED="1492077205420" MODIFIED="1492077454559">
<node TEXT="0.56" OBJECT="java.lang.Double|0.56" ID="ID_358301831" CREATED="1492077954028" MODIFIED="1492079331228"/>
</node>
</node>
</node>
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_579491758" CREATED="1492077981732" MODIFIED="1492077991968">
<node TEXT="200 OK" ID="ID_101744990" CREATED="1492077993128" MODIFIED="1492077996346"/>
</node>
</node>
</node>
</node>
<node TEXT="/basicCarambole" FOLDED="true" ID="ID_1784901522" CREATED="1492076906431" MODIFIED="1492076918086">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_978302420" CREATED="1492076954404" MODIFIED="1492076961213">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_112977325" CREATED="1492076966327" MODIFIED="1492076970569">
<node TEXT="GET" ID="ID_1652932800" CREATED="1492076971613" MODIFIED="1492076973619"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_563342352" CREATED="1492076957777" MODIFIED="1492076962841">
<node TEXT="player not found or has no carambole strikes" FOLDED="true" ID="ID_31842220" CREATED="1492077014856" MODIFIED="1492079231525">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1950951660" CREATED="1492077079034" MODIFIED="1492077138749">
<node TEXT="404 NOT FOUND" ID="ID_1430703122" CREATED="1492077097768" MODIFIED="1492077103929"/>
</node>
</node>
<node TEXT="success" FOLDED="true" ID="ID_1836559054" CREATED="1492077965946" MODIFIED="1492077972714">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_453443070" CREATED="1492077981732" MODIFIED="1492077991968">
<node TEXT="200 OK" ID="ID_627002512" CREATED="1492077993128" MODIFIED="1492077996346"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1988236786" CREATED="1492077086489" MODIFIED="1492077171482">
<node TEXT="ratio" FOLDED="true" ID="ID_1475679437" CREATED="1492077172763" MODIFIED="1492079283312">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1613035766" CREATED="1492077205420" MODIFIED="1492077454559">
<node TEXT="0.65" OBJECT="java.lang.Double|0.65" ID="ID_767104592" CREATED="1492077954028" MODIFIED="1492079289286"/>
</node>
</node>
</node>
</node>
</node>
</node>
</node>
</node>
<node TEXT="/games" FOLDED="true" ID="ID_147989827" CREATED="1492076498572" MODIFIED="1492076501142">
<node TEXT="/$id/end" FOLDED="true" ID="ID_769937977" CREATED="1491729403069" MODIFIED="1492076548559">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1842864825" CREATED="1490730029521" MODIFIED="1490730057227">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1817566502" CREATED="1490730059438" MODIFIED="1490730081928">
<node TEXT="PUT" ID="ID_1615199197" CREATED="1490730124937" MODIFIED="1491729526005"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_823890478" CREATED="1490730065473" MODIFIED="1490730082519">
<node TEXT="application/json" ID="ID_1688913219" CREATED="1490730129550" MODIFIED="1490730132636"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1834342288" CREATED="1490730071424" MODIFIED="1490730082770">
<node TEXT="{&#xa;    &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;    &quot;definitions&quot;: {},&#xa;    &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/endGame.json&quot;,&#xa;    &quot;properties&quot;: {&#xa;        &quot;end&quot;: {&#xa;            &quot;id&quot;: &quot;/properties/end&quot;,&#xa;            &quot;type&quot;: &quot;string&quot;&#xa;        }&#xa;    },&#xa;    &quot;type&quot;: &quot;object&quot;&#xa;}" ID="ID_810514740" CREATED="1491729849204" MODIFIED="1491729862676"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1376850772" CREATED="1490730075057" MODIFIED="1490730083021">
<node TEXT="{&#xa;    &quot;end&quot;: &quot;2017-08-22T17:35Z+0200&#xa;}" ID="ID_1898393545" CREATED="1491729865997" MODIFIED="1491729893219"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_615505014" CREATED="1490730034409" MODIFIED="1490730057789">
<node TEXT="success" FOLDED="true" ID="ID_1575199681" CREATED="1490730519681" MODIFIED="1491729568592">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1992778028" CREATED="1490730542729" MODIFIED="1490730547498">
<node TEXT="200 OK" ID="ID_1799370255" CREATED="1490730548305" MODIFIED="1491729576606"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1423297227" CREATED="1490730563841" MODIFIED="1490730567517">
<node TEXT="Ended game JSON" FOLDED="true" ID="ID_1072308697" CREATED="1490340276338" MODIFIED="1491729586995">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_108665781" CREATED="1490340294145" MODIFIED="1490733252056">
<node TEXT="{&quot;id&quot;:4,&quot;game_type&quot;:1,&quot;player1&quot;:1,&quot;player2&quot;:1,&quot;beginning&quot;:&quot;2017-03-30T20:26:25.574&quot;}" ID="ID_120758835" CREATED="1490340036506" MODIFIED="1491505178337"/>
</node>
</node>
</node>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_579970529" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_667277608" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_1875694137" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1534593160" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_413129580" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
<node TEXT="db problems" FOLDED="true" ID="ID_1103571253" CREATED="1490730482712" MODIFIED="1491729613113">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1491326269" CREATED="1490730059438" MODIFIED="1490730099560">
<node TEXT="406 NOT ACCEPTABLE" ID="ID_1950182467" CREATED="1490730496040" MODIFIED="1490875826138"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_891884189" CREATED="1490730065473" MODIFIED="1490730103319">
<node TEXT="message from DB exception" ID="ID_809822277" CREATED="1490875844521" MODIFIED="1490875849772"/>
</node>
</node>
</node>
</node>
<node TEXT="/new" FOLDED="true" ID="ID_1206525773" CREATED="1490875506280" MODIFIED="1492076553296">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_27010995" CREATED="1490730029521" MODIFIED="1490730057227">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_163721045" CREATED="1490730059438" MODIFIED="1490730081928">
<node TEXT="POST" ID="ID_875111680" CREATED="1490730124937" MODIFIED="1490875522346"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_743018874" CREATED="1490730065473" MODIFIED="1490730082519">
<node TEXT="application/json" ID="ID_1561793299" CREATED="1490730129550" MODIFIED="1490730132636"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1184544468" CREATED="1490730071424" MODIFIED="1490730082770">
<node TEXT="{&#xa;  &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;  &quot;definitions&quot;: {},&#xa;  &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/newGame.json&quot;,&#xa;  &quot;properties&quot;: {&#xa;    &quot;carambolesToWin&quot;: {&#xa;      &quot;id&quot;: &quot;/properties/carambolesToWin&quot;,&#xa;      &quot;type&quot;: &quot;integer&quot;&#xa;    },&#xa;    &quot;gameType&quot;: {&#xa;      &quot;id&quot;: &quot;/properties/gameType&quot;,&#xa;      &quot;type&quot;: &quot;integer&quot;&#xa;    },&#xa;    &quot;player1&quot;: {&#xa;      &quot;id&quot;: &quot;/properties/player1&quot;,&#xa;      &quot;type&quot;: &quot;integer&quot;&#xa;    },&#xa;    &quot;player2&quot;: {&#xa;      &quot;id&quot;: &quot;/properties/player2&quot;,&#xa;      &quot;type&quot;: &quot;integer&quot;&#xa;    },&#xa;    &quot;beginning&quot; : {&#xa;       &quot;id&quot;: &quot;/properties/beginning&quot;,&#xa;       &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;rounds&quot;: {&#xa;      &quot;id&quot;: &quot;/properties/rounds&quot;,&#xa;      &quot;type&quot;: &quot;integer&quot;&#xa;    },&#xa;    &quot;tournament&quot;: {&#xa;      &quot;id&quot;: &quot;/properties/tournament&quot;,&#xa;      &quot;type&quot;: &quot;integer&quot;&#xa;    }&#xa;  },&#xa;  &quot;required&quot;: [&#xa;    &quot;gameType&quot;,&#xa;    &quot;player2&quot;,&#xa;    &quot;player1&quot;&#xa;  ],&#xa;  &quot;type&quot;: &quot;object&quot;&#xa;}&#xa;vertical_align_top" ID="ID_824066760" CREATED="1490733114857" MODIFIED="1491477760560"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1747456360" CREATED="1490730075057" MODIFIED="1490730083021">
<node TEXT="{&#xa;&quot;gameType&quot;: 1,&#xa;&quot;player1&quot; : 1,&#xa;&quot;player2&quot; : 1,&#xa;&quot;beginning&quot; : &quot;2017-04-06T14:00:00Z+0300&quot;&#xa;}" ID="ID_261993478" CREATED="1490730477097" MODIFIED="1491483851965"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_513235008" CREATED="1490730034409" MODIFIED="1490730057789">
<node TEXT="created" FOLDED="true" ID="ID_490163230" CREATED="1490730519681" MODIFIED="1490875863127">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1980737946" CREATED="1490730542729" MODIFIED="1490730547498">
<node TEXT="201 CREATED" ID="ID_25167275" CREATED="1490730548305" MODIFIED="1490733211357"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1430333532" CREATED="1490730563841" MODIFIED="1490730567517">
<node TEXT="Created game JSON" FOLDED="true" ID="ID_382740439" CREATED="1490340276338" MODIFIED="1490898398263">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_650198463" CREATED="1490340294145" MODIFIED="1490733252056">
<node TEXT="{&quot;id&quot;:4,&quot;game_type&quot;:1,&quot;player1&quot;:1,&quot;player2&quot;:1,&quot;beginning&quot;:&quot;2017-03-30T20:26:25Z+0200&quot;}" ID="ID_1009829414" CREATED="1490340036506" MODIFIED="1491739664093"/>
</node>
</node>
</node>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_494415026" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1414595059" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_919226898" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_401263605" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_1461214082" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
<node TEXT="can&apos;t insert into DB" FOLDED="true" ID="ID_150011471" CREATED="1490730482712" MODIFIED="1490875818371">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1718427232" CREATED="1490730059438" MODIFIED="1490730099560">
<node TEXT="406 NOT ACCEPTABLE" ID="ID_605974599" CREATED="1490730496040" MODIFIED="1490875826138"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1211970338" CREATED="1490730065473" MODIFIED="1490730103319">
<node TEXT="message from DB exception" ID="ID_1210245903" CREATED="1490875844521" MODIFIED="1490875849772"/>
</node>
</node>
</node>
</node>
<node TEXT="/types/new" FOLDED="true" ID="ID_1582186992" CREATED="1490875506280" MODIFIED="1492076557298">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1021190449" CREATED="1490730029521" MODIFIED="1490730057227">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1480807260" CREATED="1490730059438" MODIFIED="1490730081928">
<node TEXT="POST" ID="ID_1861164702" CREATED="1490730124937" MODIFIED="1490875522346"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_180132163" CREATED="1490730065473" MODIFIED="1490730082519">
<node TEXT="application/json" ID="ID_853423680" CREATED="1490730129550" MODIFIED="1490730132636"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_730331434" CREATED="1490730071424" MODIFIED="1490730082770">
<node TEXT="{&#xa;  &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;  &quot;definitions&quot;: {},&#xa;  &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/newGameType.json&quot;,&#xa;  &quot;properties&quot;: {&#xa;    &quot;description&quot;: {&#xa;      &quot;id&quot;: &quot;/properties/description&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;title&quot;: {&#xa;      &quot;id&quot;: &quot;/properties/title&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    }&#xa;  },&#xa;  &quot;required&quot;: [&#xa;    &quot;title&quot;&#xa;  ],&#xa;  &quot;type&quot;: &quot;object&quot;&#xa;}" ID="ID_1637787364" CREATED="1490733114857" MODIFIED="1490875701220"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1609100444" CREATED="1490730075057" MODIFIED="1490730083021">
<node TEXT="{&#xa;  &quot;title&quot; : &quot;carambole&quot;&#xa;}" ID="ID_1313060750" CREATED="1490730477097" MODIFIED="1490875720913"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_677990443" CREATED="1490730034409" MODIFIED="1490730057789">
<node TEXT="created" FOLDED="true" ID="ID_1332457228" CREATED="1490730519681" MODIFIED="1490875863127">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1817391441" CREATED="1490730542729" MODIFIED="1490730547498">
<node TEXT="201 CREATED" ID="ID_1349201896" CREATED="1490730548305" MODIFIED="1490733211357"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1624474492" CREATED="1490730563841" MODIFIED="1490730567517">
<node TEXT="Created game type JSON" FOLDED="true" ID="ID_551033520" CREATED="1490340276338" MODIFIED="1490875880846">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_304606887" CREATED="1490340294145" MODIFIED="1490733252056">
<node TEXT="{&quot;id&quot;:2,&quot;title&quot;:&quot;Carambole&quot;}" ID="ID_654006573" CREATED="1490340036506" MODIFIED="1491505168239"/>
</node>
</node>
</node>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_88101976" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1722055995" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_453177161" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_16236783" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_1132495579" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
<node TEXT="can&apos;t insert into DB" FOLDED="true" ID="ID_1066335183" CREATED="1490730482712" MODIFIED="1490875818371">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_266792563" CREATED="1490730059438" MODIFIED="1490730099560">
<node TEXT="406 NOT ACCEPTABLE" ID="ID_1297894764" CREATED="1490730496040" MODIFIED="1490875826138"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1819425361" CREATED="1490730065473" MODIFIED="1490730103319">
<node TEXT="message from DB exception" ID="ID_1147282586" CREATED="1490875844521" MODIFIED="1490875849772"/>
</node>
</node>
</node>
</node>
</node>
<node TEXT="/strikes" FOLDED="true" ID="ID_71156860" CREATED="1492076565077" MODIFIED="1492076638493">
<node TEXT="/api/strikes/new" FOLDED="true" ID="ID_486238382" CREATED="1490875506280" MODIFIED="1490974072013">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1790589972" CREATED="1490730029521" MODIFIED="1490730057227">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_704824594" CREATED="1490730059438" MODIFIED="1490730081928">
<node TEXT="POST" ID="ID_1454092951" CREATED="1490730124937" MODIFIED="1490875522346"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_430510398" CREATED="1490730065473" MODIFIED="1490730082519">
<node TEXT="application/json" ID="ID_1920425849" CREATED="1490730129550" MODIFIED="1490730132636"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_132558869" CREATED="1490730071424" MODIFIED="1490730082770">
<node TEXT="{&#xa;    &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;    &quot;definitions&quot;: {},&#xa;    &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/newStrike.json&quot;,&#xa;    &quot;items&quot;: {&#xa;        &quot;id&quot;: &quot;/items&quot;,&#xa;        &quot;properties&quot;: {&#xa;            &quot;game&quot;: {&#xa;                &quot;id&quot;: &quot;/items/properties/game&quot;,&#xa;                &quot;type&quot;: &quot;integer&quot;&#xa;            },&#xa;            &quot;player&quot;: {&#xa;                &quot;id&quot;: &quot;/items/properties/player&quot;,&#xa;                &quot;type&quot;: &quot;integer&quot;&#xa;            },&#xa;            &quot;round&quot;: {&#xa;                &quot;id&quot;: &quot;/items/properties/round&quot;,&#xa;                &quot;type&quot;: &quot;integer&quot;&#xa;            },&#xa;            &quot;strikeType&quot;: {&#xa;                &quot;id&quot;: &quot;/items/properties/strikeType&quot;,&#xa;                &quot;type&quot;: &quot;integer&quot;&#xa;            }&#xa;        },&#xa;        &quot;required&quot;: [&#xa;            &quot;player&quot;,&#xa;            &quot;game&quot;,&#xa;            &quot;strikeType&quot;,&#xa;            &quot;round&quot;&#xa;        ],&#xa;        &quot;type&quot;: &quot;object&quot;&#xa;    },&#xa;    &quot;type&quot;: &quot;array&quot;&#xa;}" ID="ID_1516751300" CREATED="1490733114857" MODIFIED="1490974138200"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1931919447" CREATED="1490730075057" MODIFIED="1490730083021">
<node TEXT="[&#xa;  {&#xa;    &quot;strikeType&quot;: 4,&#xa;    &quot;game&quot;: 1,&#xa;    &quot;player&quot;: 1,&#xa;    &quot;round&quot;: 3&#xa;  },&#xa;  {&#xa;    &quot;strikeType&quot;: 4,&#xa;    &quot;game&quot;: 1,&#xa;    &quot;player&quot;: 1,&#xa;    &quot;round&quot;: 4&#xa;  }&#xa;]" ID="ID_1886933253" CREATED="1490730477097" MODIFIED="1490974155472"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1873324679" CREATED="1490730034409" MODIFIED="1490730057789">
<node TEXT="created" FOLDED="true" ID="ID_794541152" CREATED="1490730519681" MODIFIED="1490875863127">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_459074484" CREATED="1490730542729" MODIFIED="1490730547498">
<node TEXT="201 CREATED" ID="ID_1573422347" CREATED="1490730548305" MODIFIED="1490733211357"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" ID="ID_1849275711" CREATED="1490730563841" MODIFIED="1490730567517"/>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_132106036" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_934895387" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_1732946987" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_64463413" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_1915443127" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
<node TEXT="can&apos;t insert into DB" FOLDED="true" ID="ID_748415329" CREATED="1490730482712" MODIFIED="1490875818371">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1453719054" CREATED="1490730059438" MODIFIED="1490730099560">
<node TEXT="406 NOT ACCEPTABLE" ID="ID_259660697" CREATED="1490730496040" MODIFIED="1490875826138"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_73607967" CREATED="1490730065473" MODIFIED="1490730103319">
<node TEXT="message from DB exception" ID="ID_1199367552" CREATED="1490875844521" MODIFIED="1490875849772"/>
</node>
</node>
</node>
</node>
<node TEXT="/api/strikes/types/new" FOLDED="true" ID="ID_71683048" CREATED="1490875506280" MODIFIED="1490971550266">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_618607805" CREATED="1490730029521" MODIFIED="1490730057227">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1280879319" CREATED="1490730059438" MODIFIED="1490730081928">
<node TEXT="POST" ID="ID_789556386" CREATED="1490730124937" MODIFIED="1490875522346"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1021415658" CREATED="1490730065473" MODIFIED="1490730082519">
<node TEXT="application/json" ID="ID_1599413077" CREATED="1490730129550" MODIFIED="1490730132636"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_746254193" CREATED="1490730071424" MODIFIED="1490730082770">
<node TEXT="{&#xa;    &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;    &quot;definitions&quot;: {},&#xa;    &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/newStrikeType.json&quot;,&#xa;    &quot;properties&quot;: {&#xa;        &quot;description&quot;: {&#xa;            &quot;id&quot;: &quot;/properties/description&quot;,&#xa;            &quot;type&quot;: &quot;string&quot;&#xa;        },&#xa;        &quot;endsGame&quot;: {&#xa;            &quot;id&quot;: &quot;/properties/endsGame&quot;,&#xa;            &quot;type&quot;: &quot;boolean&quot;&#xa;        },&#xa;        &quot;gameType&quot;: {&#xa;            &quot;id&quot;: &quot;/properties/gameType&quot;,&#xa;            &quot;type&quot;: &quot;integer&quot;&#xa;        },&#xa;        &quot;title&quot;: {&#xa;            &quot;id&quot;: &quot;/properties/title&quot;,&#xa;            &quot;type&quot;: &quot;string&quot;&#xa;        }&#xa;    },&#xa;    &quot;required&quot;: [&#xa;        &quot;gameType&quot;,&#xa;        &quot;title&quot;&#xa;    ],&#xa;    &quot;type&quot;: &quot;object&quot;&#xa;}" ID="ID_446627508" CREATED="1490733114857" MODIFIED="1490971641520"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1093464550" CREATED="1490730075057" MODIFIED="1490730083021">
<node TEXT="{&#xa;  &quot;gameType&quot;: 1,&#xa;  &quot;title&quot;: &quot;Faul1&quot;&#xa;}" ID="ID_1794991907" CREATED="1490730477097" MODIFIED="1490971657669"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1933873091" CREATED="1490730034409" MODIFIED="1490730057789">
<node TEXT="created" FOLDED="true" ID="ID_622879228" CREATED="1490730519681" MODIFIED="1490875863127">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_248651750" CREATED="1490730542729" MODIFIED="1490730547498">
<node TEXT="201 CREATED" ID="ID_1272695310" CREATED="1490730548305" MODIFIED="1490733211357"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1467150485" CREATED="1490730563841" MODIFIED="1490730567517">
<node TEXT="Created strike type JSON" FOLDED="true" ID="ID_1629705716" CREATED="1490340276338" MODIFIED="1490971670187">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1065595680" CREATED="1490340294145" MODIFIED="1490733252056">
<node TEXT="{&quot;id&quot;:5,&quot;gameType&quot;:1,&quot;title&quot;:&quot;Faul1&quot;}" ID="ID_1859799576" CREATED="1490340036506" MODIFIED="1491505192293"/>
</node>
</node>
</node>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_1935844026" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1536611614" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_1887245329" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1792880723" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_1334314702" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
<node TEXT="can&apos;t insert into DB" FOLDED="true" ID="ID_1381992531" CREATED="1490730482712" MODIFIED="1490875818371">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1919729711" CREATED="1490730059438" MODIFIED="1490730099560">
<node TEXT="406 NOT ACCEPTABLE" ID="ID_1285777482" CREATED="1490730496040" MODIFIED="1490875826138"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1266316348" CREATED="1490730065473" MODIFIED="1490730103319">
<node TEXT="message from DB exception" ID="ID_1836366815" CREATED="1490875844521" MODIFIED="1490875849772"/>
</node>
</node>
</node>
</node>
</node>
<node TEXT="/passwdupdate" FOLDED="true" ID="ID_1472921065" CREATED="1490733049057" MODIFIED="1492076604193">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_159873632" CREATED="1490730029521" MODIFIED="1490730057227">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_579513219" CREATED="1490730059438" MODIFIED="1490730081928">
<node TEXT="PUT" ID="ID_669973201" CREATED="1490730124937" MODIFIED="1490730126609"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1751580881" CREATED="1490730065473" MODIFIED="1490730082519">
<node TEXT="application/json" ID="ID_382269736" CREATED="1490730129550" MODIFIED="1490730132636"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1553859382" CREATED="1490730071424" MODIFIED="1490730082770">
<node TEXT="{&#xa;    &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;    &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/passwdupdate.json&quot;,&#xa;    &quot;properties&quot;: {&#xa;        &quot;email&quot;: {&#xa;            &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/passwdupdate.json/email&quot;,&#xa;            &quot;type&quot;: &quot;string&quot;&#xa;        },&#xa;        &quot;oldPassword&quot;: {&#xa;            &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/passwdupdate.json/oldPassword&quot;,&#xa;            &quot;type&quot;: &quot;string&quot;&#xa;        },&#xa;        &quot;newPassword&quot;: {&#xa;            &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/passwdupdate.json/newPassword&quot;,&#xa;            &quot;type&quot;: &quot;string&quot;&#xa;        }&#xa;    },&#xa;    &quot;required&quot;: [&#xa;        &quot;email&quot;,&#xa;&quot;oldPassword&quot;,&#xa;        &quot;newPassword&quot;&#xa;    ],&#xa;    &quot;type&quot;: &quot;object&quot;&#xa;}" ID="ID_1683524756" CREATED="1490730447673" MODIFIED="1490801183180"/>
<node TEXT="" ID="ID_856976535" CREATED="1490733114857" MODIFIED="1490733114857"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1091224250" CREATED="1490730075057" MODIFIED="1490730083021">
<node TEXT="{&#xa;  &quot;email&quot;: &quot;abc@gmail.com&quot;,&#xa;  &quot;oldPassword&quot; : &quot;1f1g3abc&quot;,&#xa;  &quot;newPassword&quot;:&quot;newPassword1234&quot;&#xa;}" ID="ID_940900207" CREATED="1490730477097" MODIFIED="1490801212499"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1268653486" CREATED="1490730034409" MODIFIED="1490730057789">
<node TEXT="email not found" FOLDED="true" ID="ID_1403288338" CREATED="1490730482712" MODIFIED="1490730490139">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_765391337" CREATED="1490730059438" MODIFIED="1490730099560">
<node TEXT="404 NOT FOUND" ID="ID_1201041361" CREATED="1490730496040" MODIFIED="1490730499941"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1436789116" CREATED="1490730065473" MODIFIED="1490730103319">
<node TEXT="Email ${email} not found" ID="ID_1933347840" CREATED="1490730501552" MODIFIED="1490730517748"/>
</node>
</node>
<node TEXT="password updated" FOLDED="true" ID="ID_1105336001" CREATED="1490730519681" MODIFIED="1490801248123">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_33021968" CREATED="1490730542729" MODIFIED="1490730547498">
<node TEXT="201 CREATED" ID="ID_1192721166" CREATED="1490730548305" MODIFIED="1490733211357"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1875487836" CREATED="1490730563841" MODIFIED="1490730567517">
<node TEXT="Updated user as a JSON" FOLDED="true" ID="ID_174962100" CREATED="1490340276338" MODIFIED="1490733284640">
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_631151213" CREATED="1490340294145" MODIFIED="1490733252056">
<node TEXT="{&#xa;  &quot;id&quot;: 123,&#xa;  &quot;login&quot;: &quot;user1&quot;,&#xa;  &quot;email&quot;: &quot;user1@coolecnik.com&quot;,&#xa;  &quot;passwordHash&quot;: &quot;newPassword1234&quot;,&#xa;  &quot;firstName&quot;: &quot;User&quot;,&#xa;  &quot;lastName&quot;: &quot;Smith&quot;&#xa;}" ID="ID_321888174" CREATED="1490340036506" MODIFIED="1490733303896"/>
</node>
</node>
</node>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_948421245" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_343295455" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_1281075654" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1836808496" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_1775814847" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
<node TEXT="wrong old password" FOLDED="true" ID="ID_1344342752" CREATED="1490730482712" MODIFIED="1490801261132">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_65942611" CREATED="1490730059438" MODIFIED="1490730099560">
<node TEXT="401 UNAUTHORIZED" ID="ID_532613500" CREATED="1490730496040" MODIFIED="1490801286229"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1157472566" CREATED="1490730065473" MODIFIED="1490730103319">
<node TEXT="Wrong recovery password" ID="ID_168184873" CREATED="1490730501552" MODIFIED="1490801293550"/>
</node>
</node>
</node>
</node>
<node TEXT="/passwdreset" FOLDED="true" ID="ID_1612113672" CREATED="1490730007761" MODIFIED="1492076607265">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1198573224" CREATED="1490730029521" MODIFIED="1490730057227">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1941341720" CREATED="1490730059438" MODIFIED="1490730081928">
<node TEXT="PUT" ID="ID_82695773" CREATED="1490730124937" MODIFIED="1490730126609"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_743921154" CREATED="1490730065473" MODIFIED="1490730082519">
<node TEXT="application/json" ID="ID_143489603" CREATED="1490730129550" MODIFIED="1490730132636"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_690030308" CREATED="1490730071424" MODIFIED="1490730082770">
<node TEXT="{&#xa;    &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;    &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/passwdreset.json&quot;,&#xa;    &quot;properties&quot;: {&#xa;        &quot;email&quot;: {&#xa;            &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/passwdreset.json/email&quot;,&#xa;            &quot;type&quot;: &quot;string&quot;&#xa;        },&#xa;        &quot;restorePassword&quot;: {&#xa;            &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/passwdreset.json/recoveryPassword&quot;,&#xa;            &quot;type&quot;: &quot;string&quot;&#xa;        }&#xa;    },&#xa;    &quot;required&quot;: [&#xa;        &quot;email&quot;&#xa;    ],&#xa;    &quot;type&quot;: &quot;object&quot;&#xa;}" ID="ID_1504091892" CREATED="1490730447673" MODIFIED="1490864331991"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_784493746" CREATED="1490730075057" MODIFIED="1490730083021">
<node TEXT="{&#xa;  &quot;email&quot;: &quot;abc@gmail.com&quot;&#xa;}" ID="ID_1387100200" CREATED="1490730477097" MODIFIED="1490730617505"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_265969750" CREATED="1490730034409" MODIFIED="1490730057789">
<node TEXT="email not found" FOLDED="true" ID="ID_183735857" CREATED="1490730482712" MODIFIED="1490730490139">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" ID="ID_75189759" CREATED="1490730059438" MODIFIED="1490730099560">
<node TEXT="404 NOT FOUND" ID="ID_250315605" CREATED="1490730496040" MODIFIED="1490730499941"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" ID="ID_811050479" CREATED="1490730065473" MODIFIED="1490730103319">
<node TEXT="Email ${email} not found" ID="ID_1703675479" CREATED="1490730501552" MODIFIED="1490730517748"/>
</node>
</node>
<node TEXT="recovery password sent" FOLDED="true" ID="ID_1837354459" CREATED="1490730519681" MODIFIED="1490730541991">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_935830168" CREATED="1490730542729" MODIFIED="1490730547498">
<node TEXT="202 ACCEPTED" ID="ID_321220115" CREATED="1490730548305" MODIFIED="1490730557685"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1505053175" CREATED="1490730563841" MODIFIED="1490730567517">
<node TEXT="{&#xa;  &quot;email&quot;: &quot;abc@gmail.com&quot;,&#xa;  &quot;recoveryPassword&quot; : &quot;abc123&quot;&#xa;}" ID="ID_1992680639" CREATED="1490730568640" MODIFIED="1490730605976"/>
</node>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_1457592617" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_349506270" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_549205656" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_349593624" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_204486036" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
</node>
</node>
</node>
</node>
</node>
</map>
