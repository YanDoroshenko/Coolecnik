<map version="freeplane 1.5.9">
<!--To view this file, download free mind mapping software Freeplane from http://freeplane.sourceforge.net -->
<node TEXT="Coolecnik REST API" FOLDED="false" ID="ID_1387381223" CREATED="1490338875762" MODIFIED="1490338883995" STYLE="oval">
<font SIZE="18"/>
<hook NAME="MapStyle">
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
<hook NAME="AutomaticEdgeColor" COUNTER="6" RULE="ON_BRANCH_CREATION"/>
<node TEXT="functionality" LOCALIZED_STYLE_REF="styles.subsubtopic" POSITION="right" ID="ID_204372916" CREATED="1490339000619" MODIFIED="1490340565218">
<node TEXT="registration" ID="ID_439902513" CREATED="1490338952202" MODIFIED="1490343416383" LINK="#ID_1838319806"/>
<node TEXT="login" ID="ID_361722778" CREATED="1490338943946" MODIFIED="1490343402007" LINK="#ID_656188260"/>
</node>
<node TEXT="endpoints" LOCALIZED_STYLE_REF="styles.subsubtopic" POSITION="right" ID="ID_598258874" CREATED="1490339036906" MODIFIED="1490340558307">
<node TEXT="/api/register" FOLDED="true" ID="ID_1838319806" CREATED="1490339047850" MODIFIED="1490339055230">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_1153028670" CREATED="1490339093794" MODIFIED="1490340644196">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_460586185" CREATED="1490339110938" MODIFIED="1490340646370">
<node TEXT="GET" ID="ID_314272529" CREATED="1490339138114" MODIFIED="1490339138943"/>
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
<node TEXT="example" FOLDED="true" ID="ID_357099164" CREATED="1490340294145" MODIFIED="1490340296733">
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
<node TEXT="example" FOLDED="true" ID="ID_72808023" CREATED="1490340364562" MODIFIED="1490340366619">
<node TEXT="Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections." ID="ID_1423474431" CREATED="1490340367610" MODIFIED="1490340378085"/>
<node TEXT="ERROR: duplicate key value violates unique constraint &quot;players_email_idx&quot;&#xa;  Detail: Key (email)=(l23&#x430;&#x43f;&#x432;&#x430;4563) already exists." ID="ID_1041691457" CREATED="1490340394466" MODIFIED="1490340395414"/>
</node>
</node>
</node>
</node>
</node>
</node>
<node TEXT="/api/login" FOLDED="true" ID="ID_656188260" CREATED="1490339056282" MODIFIED="1490339059533">
<node TEXT="request" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_582743712" CREATED="1490339093794" MODIFIED="1490340644196">
<node TEXT="method" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1609172563" CREATED="1490339110938" MODIFIED="1490340646370">
<node TEXT="GET" ID="ID_1954440184" CREATED="1490339138114" MODIFIED="1490339138943"/>
</node>
<node TEXT="content-type" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_762647841" CREATED="1490339128682" MODIFIED="1490340646668">
<node TEXT="application/json" ID="ID_320405408" CREATED="1490339854082" MODIFIED="1490339859181"/>
</node>
<node TEXT="schema" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1909823858" CREATED="1490339115410" MODIFIED="1490340646964">
<node TEXT="{&#xa;  &quot;$schema&quot;: &quot;http://json-schema.org/draft-04/schema#&quot;,&#xa;  &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json&quot;,&#xa;  &quot;properties&quot;: {&#xa;    &quot;login&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/login&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;email&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/email&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;passwordHash&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/passwordHash&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;firstName&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/firstName&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    },&#xa;    &quot;lastName&quot;: {&#xa;      &quot;id&quot;: &quot;http://coolecnik.felk.cvut.cz/registration.json/lastName&quot;,&#xa;      &quot;type&quot;: &quot;string&quot;&#xa;    }&#xa;  },&#xa;  &quot;required&quot;: [&#xa;    &quot;login&quot;,&#xa;    &quot;passwordHash&quot;,&#xa;    &quot;email&quot;&#xa;  ],&#xa;  &quot;type&quot;: &quot;object&quot;&#xa;}" ID="ID_1620114458" CREATED="1490339301882" MODIFIED="1490339844458"/>
</node>
<node TEXT="example" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1469875075" CREATED="1490339119666" MODIFIED="1490340647196">
<node TEXT="{&#xa;  &quot;login&quot;: &quot;user1&quot;,&#xa;  &quot;email&quot;: &quot;user1@coolecnik.com&quot;,&#xa;  &quot;passwordHash&quot;: &quot;@w3s0m3_p4ssw0rd&quot;,&#xa;  &quot;firstName&quot;: &quot;User&quot;,&#xa;  &quot;lastName&quot;: &quot;Smith&quot;&#xa;}" ID="ID_765399102" CREATED="1490339360474" MODIFIED="1490339407446"/>
</node>
</node>
<node TEXT="response" LOCALIZED_STYLE_REF="styles.subsubtopic" FOLDED="true" ID="ID_363948555" CREATED="1490339105938" MODIFIED="1490340644996">
<node TEXT="registered succesfully" FOLDED="true" ID="ID_1638230469" CREATED="1490339865890" MODIFIED="1490340086987">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1451528939" CREATED="1490339886618" MODIFIED="1490340529009">
<node TEXT="201 CREATED" ID="ID_1798796570" CREATED="1490340088426" MODIFIED="1490340091502"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_75597941" CREATED="1490340031618" MODIFIED="1490340533137">
<node TEXT="Created user as a JSON" FOLDED="true" ID="ID_1836523156" CREATED="1490340276338" MODIFIED="1490340293437">
<node TEXT="example" FOLDED="true" ID="ID_1550389192" CREATED="1490340294145" MODIFIED="1490340296733">
<node TEXT="{&#xa;  &quot;id&quot;: 123,&#xa;  &quot;login&quot;: &quot;user1&quot;,&#xa;  &quot;email&quot;: &quot;user1@coolecnik.com&quot;,&#xa;  &quot;passwordHash&quot;: &quot;@w3s0m3_p4ssw0rd&quot;,&#xa;  &quot;firstName&quot;: &quot;User&quot;,&#xa;  &quot;lastName&quot;: &quot;Smith&quot;&#xa;}" ID="ID_367960377" CREATED="1490340036506" MODIFIED="1490340046902"/>
</node>
</node>
</node>
</node>
<node TEXT="can&apos;t deserialize JSON" FOLDED="true" ID="ID_1875694184" CREATED="1490339882146" MODIFIED="1490340107973">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1824011381" CREATED="1490340050658" MODIFIED="1490340536352">
<node TEXT="400 BAD REQUEST" ID="ID_1313723345" CREATED="1490340204657" MODIFIED="1490340210420"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1786461221" CREATED="1490340253026" MODIFIED="1490340539716">
<node TEXT="Request can&apos;t be deserialized" ID="ID_573080437" CREATED="1490340257682" MODIFIED="1490340258861"/>
</node>
</node>
<node TEXT="can&apos;t insert user into DB" FOLDED="true" ID="ID_1992527257" CREATED="1490340112410" MODIFIED="1490340120004">
<node TEXT="status" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_111266835" CREATED="1490340050658" MODIFIED="1490340568782">
<node TEXT="406 NOT ACCEPTABLE" ID="ID_743223346" CREATED="1490340380722" MODIFIED="1490340384492"/>
</node>
<node TEXT="body" LOCALIZED_STYLE_REF="styles.subtopic" FOLDED="true" ID="ID_1575207300" CREATED="1490340058722" MODIFIED="1490340572641">
<node TEXT="message from DB exception" FOLDED="true" ID="ID_1896355224" CREATED="1490340326210" MODIFIED="1490340337739">
<node TEXT="example" FOLDED="true" ID="ID_44374747" CREATED="1490340364562" MODIFIED="1490340366619">
<node TEXT="Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections." ID="ID_105552562" CREATED="1490340367610" MODIFIED="1490340378085"/>
<node TEXT="ERROR: duplicate key value violates unique constraint &quot;players_email_idx&quot;&#xa;  Detail: Key (email)=(l23&#x430;&#x43f;&#x432;&#x430;4563) already exists." ID="ID_1864010052" CREATED="1490340394466" MODIFIED="1490340395414"/>
</node>
</node>
</node>
</node>
</node>
</node>
</node>
</node>
</map>
