(this.webpackJsonpboardgame_app=this.webpackJsonpboardgame_app||[]).push([[0],{112:function(e,t,a){e.exports=a(143)},117:function(e,t,a){},118:function(e,t,a){},143:function(e,t,a){"use strict";a.r(t);var n,r=a(0),c=a.n(r),i=a(14),o=a.n(i),l=(a(117),a(45)),s=a(50),u=a(16),m=(a(118),a(144)),d=a(196),h=a(105),p=a(195),E=a(194),f="justone.okj.name"===window.location.hostname?"":":9000",y=window.location.protocol+"//"+window.location.hostname+f+"/api"+"/games";!function(e){e.AUTO="automatisch",e.BRIGHT="hell",e.DARK="dunkel"}(n||(n={}));var v,g=a(179),b=a(176),O=a(180),N=a(181),j=a(182),C=a(59),k=a(184),G=a(106),M=a(186),S=a(187),P=a(183),A=a(185),I=a(188),w=a(189),T=a(6),H=a(7),R=a(9),W=a(8),K=a(200),D=a(175),_=a(177),L=a(146),U=a(178),B=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){return Object(T.a)(this,a),t.apply(this,arguments)}return Object(H.a)(a,[{key:"render",value:function(){var e=this.props,t=e.tKey,a=e.open,n=e.onClose,r=e.selectedValue,i=e.possibleValues;return c.a.createElement(K.a,{onClose:function(){n(r)},open:a},c.a.createElement(D.a,null,c.a.createElement(b.a,{i18nKey:t},"Einstellung")),c.a.createElement(_.a,null,i.map((function(e){return c.a.createElement(L.a,{button:!0,onClick:function(){return function(e){n(e)}(e.val)},key:e.val,selected:r===e.val},c.a.createElement(U.a,{primary:c.a.createElement(b.a,{i18nKey:e.tKey},e.val)}))}))))}}]),a}(c.a.Component),x=function(e){var t=Object(g.a)().i18n,a=e.userTheme,r=e.applyUserTheme,i=c.a.useState(!1),o=Object(l.a)(i,2),u=o[0],m=o[1],d=c.a.useState(!1),h=Object(l.a)(d,2),p=h[0],E=h[1],f=c.a.useState(t.language),y=Object(l.a)(f,2),v=y[0],T=y[1],H=c.a.useState(null),R=Object(l.a)(H,2),W=R[0],K=R[1],D=function(e){var t=e.currentTarget;K(t)},_=function(){K(null)},L=localStorage.getItem("playerName"),U=[{val:n.AUTO,tKey:"THEMEPICK.AUTO"},{val:n.BRIGHT,tKey:"THEMEPICK.BRIGHT"},{val:n.DARK,tKey:"THEMEPICK.DARK"}];return c.a.createElement(O.a,{position:"sticky"},c.a.createElement(N.a,null,c.a.createElement(s.b,{to:"/",className:"ButtonLink"},c.a.createElement(j.a,{edge:"start",color:"inherit","aria-label":"home"},c.a.createElement(P.a,null))),c.a.createElement(C.a,{variant:"h2",className:"appTitle"},c.a.createElement(b.a,{i18nKey:"APP_TITLE"},"Nur ein Wort!")),L?c.a.createElement(k.a,{onClick:D,className:"Account-button",color:"inherit",startIcon:c.a.createElement(A.a,null)},L):c.a.createElement(j.a,{onClick:D,edge:"end",color:"inherit"},c.a.createElement(A.a,null)),c.a.createElement(G.a,{anchorEl:W,keepMounted:!0,open:Boolean(W),onClose:_},c.a.createElement(M.a,{onClick:function(){m(!0),_()}},c.a.createElement(S.a,null,c.a.createElement(I.a,null)),c.a.createElement(b.a,{i18nKey:"THEMEPICK.HEADING"},"Nachtmodus")),c.a.createElement(M.a,{onClick:function(){E(!0),_()}},c.a.createElement(S.a,null,c.a.createElement(w.a,null)),c.a.createElement(b.a,{i18nKey:"LANGPICK.HEADING"},"Sprache"))),c.a.createElement(B,{tKey:"THEMEPICK.HEADING",open:u,onClose:function(e){r(e),m(!1)},selectedValue:a,possibleValues:U}),c.a.createElement(B,{tKey:"LANGPICK.HEADING",open:p,onClose:function(e){!function(e){T(e),t.changeLanguage(e)}(e),E(!1)},selectedValue:v,possibleValues:[{val:"de",tKey:"LANGPICK.DE"},{val:"en",tKey:"LANGPICK.EN"}]})))},Y=a(15),z=a.n(Y),V=a(26),J=a(11),q=a(197),F=a(190),Q=a(103),X=a.n(Q);!function(e){e[e.Init=0]="Init",e[e.Preparation=1]="Preparation",e[e.HintWriting=2]="HintWriting",e[e.HintComparing=3]="HintComparing",e[e.Guessing=4]="Guessing",e[e.Solution=5]="Solution",e[e.End=6]="End"}(v||(v={}));var Z=a(80),$=a.n(Z),ee=a(81),te=a(100),ae=a(102),ne=a(35);ee.a.use(te.a).use(ae.a).use(ne.f).init({fallbackLng:"de",debug:!0,initImmediate:!1,interpolation:{escapeValue:!1}});var re=ee.a;function ce(){var e=localStorage.getItem("playerId")||"";return e||($.a.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\xfc\xdc"),e=$()(),localStorage.setItem("playerId",e)),e}function ie(e){return oe(e,ce())}function oe(e,t){return e.players.find((function(e){return e.id===t}))}function le(e){document.title=e?"".concat(re.t("APP_TITLE","Nur ein Wort!")," - ").concat(e):re.t("APP_TITLE","Nur ein Wort!")}var se=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){var e;Object(T.a)(this,a);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(e=t.call.apply(t,[this].concat(r))).currentUserId=localStorage.getItem("playerId")||"",e.currentUserName=localStorage.getItem("playerName")||"",e}return Object(H.a)(a,[{key:"render",value:function(){var e=this,t=this.props,a=t.allGames,n=t.deleteGame,r=a.filter((function(e){return e.phase===v.Init&&!ie(e)})),i=a.filter((function(e){return![v.Init,v.End].includes(e.phase)||e.phase===v.Init&&!!ie(e)})),o=a.filter((function(e){return e.phase===v.End})),l=function(t){var a=t.players.map((function(e){return e.name})).join(", ")||"-";return c.a.createElement(L.a,Object.assign({key:t.id,className:"GameListItem"},{to:"/".concat(t.id)},{component:s.b,button:!0}),c.a.createElement(U.a,{id:t.id,primary:"".concat(t.name||t.id),secondary:c.a.createElement(b.a,{i18nKey:"HOME.GAME_LIST.PLAYERS"},"Spieler: ",{playersString:a})}),e.currentUserId===t.host&&c.a.createElement(F.a,null,c.a.createElement(j.a,{onClick:function(){return n(t.id)}},c.a.createElement(X.a,null))))},u=r.map(l),d=i.map(l),h=o.map(l);return c.a.createElement("div",{className:"GameList"},d.length>0&&c.a.createElement(m.a,null,c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"HOME.GAME_LIST.ONGOING"},"Meine laufenden Spiele")),c.a.createElement(_.a,null,d)),u.length>0&&c.a.createElement(m.a,null,c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"HOME.GAME_LIST.NEW"},"Neue Spiele")),c.a.createElement(_.a,null,u)),h.length>0&&c.a.createElement(m.a,null,c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"HOME.GAME_LIST.DONE"},"Meine beendeten Spiele")),c.a.createElement(_.a,null,h)))}}]),a}(c.a.Component),ue=a(47);function me(){return de.apply(this,arguments)}function de(){return(de=Object(V.a)(z.a.mark((function e(){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Ce("all");case 2:if(e.t0=e.sent.games,e.t0){e.next=5;break}e.t0=[];case 5:return e.abrupt("return",e.t0);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function he(e){return pe.apply(this,arguments)}function pe(){return(pe=Object(V.a)(z.a.mark((function e(t){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Ce(t);case 2:return e.abrupt("return",e.sent.game);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Ee(e){return fe.apply(this,arguments)}function fe(){return(fe=Object(V.a)(z.a.mark((function e(t){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",ke("add",{game:t}));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ye(e){return t="delete/".concat(e),new Promise((function(e,a){fetch("".concat(y,"/").concat(t),{method:"DELETE",headers:Object(ue.a)({},Me())}).then((function(t){e()}),(function(e){console.error(e),a(e)}))}));var t}function ve(e,t){return ge.apply(this,arguments)}function ge(){return(ge=Object(V.a)(z.a.mark((function e(t,a){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Ge("".concat(t,"/addPlayer"),{player:a});case 2:return e.abrupt("return",e.sent.player);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function be(e,t){return Oe.apply(this,arguments)}function Oe(){return(Oe=Object(V.a)(z.a.mark((function e(t,a){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Ge("".concat(t,"/updatePlayer"),{player:a});case 2:return e.abrupt("return",e.sent.player);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Ne(e,t){return Ge("".concat(e,"/startPreparation"),{wordsPerPlayer:t})}function je(e,t){return Ge("".concat(e,"/resolve"),{correct:t})}function Ce(e){return new Promise((function(t,a){fetch("".concat(y,"/").concat(e),{method:"GET",headers:Object(ue.a)({},Me())}).then((function(e){return e.json()})).then((function(e){t(e)}),(function(e){console.error(e),a(e)}))}))}function ke(e,t){return new Promise((function(a,n){fetch("".concat(y,"/").concat(e),{method:"POST",headers:Object(ue.a)(Object(ue.a)({},Me()),{},{Accept:"application/json","Content-Type":"application/json"}),body:JSON.stringify(t)}).then((function(e){return e.json()})).then((function(e){a(e)}),(function(e){console.error(e),n(e)}))}))}function Ge(e,t){return new Promise((function(a,n){fetch("".concat(y,"/").concat(e),{method:"PUT",headers:Object(ue.a)(Object(ue.a)({},Me()),{},{Accept:"application/json","Content-Type":"application/json"}),body:JSON.stringify(t)}).then((function(e){e.json().then((function(e){a(e)}),(function(e){a()}))}),(function(e){console.error(e),n(e)}))}))}function Me(){return{Authorization:ce()}}var Se=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).currentUserId=localStorage.getItem("playerId")||"",n.currentUserName=localStorage.getItem("playerName")||"",n._interval=void 0,n._isMounted=!1,n.createGame=n.createGame.bind(Object(J.a)(n)),n.handleChange=n.handleChange.bind(Object(J.a)(n)),n.deleteGame=n.deleteGame.bind(Object(J.a)(n)),n.state={allGames:[],newGameName:null},n}return Object(H.a)(a,[{key:"componentDidMount",value:function(){this._isMounted=!0,le(),this.loadGames(),this._interval=window.setInterval(this.loadGames.bind(this),3e3)}},{key:"componentWillUnmount",value:function(){this._isMounted=!1,clearInterval(this._interval)}},{key:"loadGames",value:function(){var e=Object(V.a)(z.a.mark((function e(){var t;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,me();case 2:if(t=e.sent,this._isMounted){e.next=5;break}return e.abrupt("return");case 5:this.setState({allGames:t});case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"deleteGame",value:function(e){ye(e),this.setState((function(t){return{allGames:t.allGames.filter((function(t){return t.id!==e}))}}))}},{key:"handleChange",value:function(e){this.setState({newGameName:e.target.value})}},{key:"createGame",value:function(){var e=Object(V.a)(z.a.mark((function e(){var t,a,n,r,c;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={id:"",name:"",words:[],players:[],host:"",wordsPerPlayer:2,round:0,phase:0,hints:[],correctWords:[],wrongWords:[]},null===(a=this.state.newGameName)&&(a=Pe(this.currentUserName)),t.name=a,e.next=6,Ee(t);case 6:n=e.sent,r=n.id,c=n.playerId,this.currentUserId!==c&&localStorage.setItem("playerId",c),window.location.href="/"+r;case 11:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state,t=e.newGameName,a=e.allGames;return null===t&&(t=Pe(this.currentUserName)),c.a.createElement("div",{className:"JustOneHome"},c.a.createElement(q.a,{label:"Spielname",value:t,onChange:this.handleChange}),c.a.createElement(k.a,{variant:"contained",color:"primary",onClick:this.createGame},c.a.createElement(b.a,{i18nKey:"HOME.NEW_GAME"},"Neues Spiel")),c.a.createElement(se,{allGames:a,deleteGame:this.deleteGame}))}}]),a}(c.a.Component);function Pe(e){return e?re.t("HOME.NEW_GAME_PERSONAL","Neues Spiel",{name:e}):re.t("HOME.NEW_GAME","Neues Spiel")}var Ae=a(191),Ie=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).state={value:""},n.handleChange=n.handleChange.bind(Object(J.a)(n)),n.submitHint=n.submitHint.bind(Object(J.a)(n)),n.keyPressed=n.keyPressed.bind(Object(J.a)(n)),n}return Object(H.a)(a,[{key:"handleChange",value:function(e){this.setState({value:e.target.value})}},{key:"submitHint",value:function(){this.props.submitHint(this.state.value),this.setState({value:""})}},{key:"keyPressed",value:function(e){"Enter"===e.key&&this.submitHint()}},{key:"render",value:function(){return c.a.createElement("div",{className:"Word-hint-input"},c.a.createElement(q.a,{label:this.props.label||re.t("GAME.COMMON.ENTER_HINT","Hinweis eingeben"),value:this.state.value,onChange:this.handleChange,onKeyPress:this.keyPressed}),c.a.createElement(j.a,{color:"primary",disabled:!this.state.value,onClick:this.submitHint},c.a.createElement(Ae.a,null)))}}]),a}(c.a.Component),we=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){return Object(T.a)(this,a),t.apply(this,arguments)}return Object(H.a)(a,[{key:"render",value:function(){var e={backgroundColor:this.props.color},t={borderTopColor:this.props.color};return c.a.createElement("div",{className:"pencil"},c.a.createElement("div",{className:"body",style:e}),c.a.createElement("div",{className:"nib",style:t}))}}]),a}(c.a.Component),Te=a(199),He=a(192),Re=a(193),We=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){return Object(T.a)(this,a),t.apply(this,arguments)}return Object(H.a)(a,[{key:"render",value:function(){var e=this.props.hint,t=this.props.color,a={color:t,borderColor:t},n=this.props.author,r=this.props.showPencil||!this.props.hint,i=this.props.showCheck,o=this.props.showDuplicateToggle,l=this.props.toggleDuplicate,s=["Word-hint"];r&&s.push("Word-hint-writing"),this.props.duplicate&&s.push("Word-hint-duplicate"),e&&e.length>20?s.push("Word-hint-huge"):e&&e.length>14&&s.push("Word-hint-long");var u=s.join(" ");return this.props.showInput&&this.props.submitHint?c.a.createElement(m.a,{className:u,style:a},c.a.createElement(Ie,{submitHint:this.props.submitHint}),n&&c.a.createElement("span",{className:"Author-tag"},n)):c.a.createElement(m.a,{className:u,style:a},!i&&e,i&&c.a.createElement("span",{className:"Done-icon"},"\u2713"),r&&c.a.createElement(we,{color:t}),o&&l&&c.a.createElement(Te.a,{className:"Duplicate-toggle",icon:c.a.createElement(He.a,null),checkedIcon:c.a.createElement(Re.a,null),checked:this.props.duplicate,onChange:function(){return l()}}),n&&c.a.createElement("span",{className:"Author-tag"},n))}}]),a}(c.a.Component),Ke=a(104),De=a.n(Ke),_e=["#e51235","#d81b60","#8e24aa","#6e45c1","#4959cc","#1e88e5","#039be5","#00acc1","#00897b","#43a047","#7cb342","#c0ca33","#ffc215","#ffab00","#ff6d00","#f4511e"];function Le(e){return e&&_e.includes(e)?e:_e[Math.floor(Math.random()*_e.length)]}var Ue=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){return Object(T.a)(this,a),t.apply(this,arguments)}return Object(H.a)(a,[{key:"render",value:function(){var e=this.props,t=e.selected,a=e.select,n=_e.map((function(e){var n=["Color-button"];return t===e&&n.push("Color-selected"),c.a.createElement(j.a,{className:n.join(" "),onClick:function(){return a(e)},style:{backgroundColor:e},key:e},t===e&&c.a.createElement(De.a,null))}));return c.a.createElement("div",{className:"Color-picker"},n)}}]),a}(c.a.Component),Be=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).handleChange=n.handleChange.bind(Object(J.a)(n)),n.setColor=n.setColor.bind(Object(J.a)(n)),n.addPlayer=n.addPlayer.bind(Object(J.a)(n)),n}return Object(H.a)(a,[{key:"handleChange",value:function(e){"name"===e.target.name&&(this.props.currentPlayer.name=e.target.value,this.props.updatePlayer(this.props.currentPlayer))}},{key:"setColor",value:function(e){this.props.currentPlayer.color=e,this.props.updatePlayer(this.props.currentPlayer)}},{key:"addPlayer",value:function(){this.props.addPlayer(this.props.currentPlayer)}},{key:"render",value:function(){var e=this.props.currentPlayer;return c.a.createElement("div",{className:"New-player"},c.a.createElement(q.a,{required:!0,label:"Spielername",name:"name",value:e.name,onChange:this.handleChange}),c.a.createElement(Ue,{select:this.setColor,selected:e.color}),c.a.createElement(k.a,{variant:"contained",color:"primary",disabled:!e.name,onClick:this.addPlayer},"Mitspielen"))}}]),a}(c.a.Component),xe=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){return Object(T.a)(this,a),t.apply(this,arguments)}return Object(H.a)(a,[{key:"render",value:function(){for(var e=this.props,t=e.open,a=e.onClose,n=e.numOfPlayers,r=[],i=function(e){var t=e+1;r.push(c.a.createElement(L.a,{button:!0,onClick:function(){a(t)},key:t},c.a.createElement(U.a,{primary:c.a.createElement(b.a,{i18nKey:"GAME.LOBBY.ROUND_SELECT.NUM",count:t*n},t*n," Runden"),secondary:c.a.createElement(b.a,{i18nKey:"GAME.LOBBY.ROUND_SELECT.WORDS",count:t},t," Begriff(e) pro Spieler")})))},o=0;o<3;o++)i(o);return c.a.createElement(K.a,{onClose:function(){a()},open:t,disableBackdropClick:!0},c.a.createElement(D.a,null,c.a.createElement(b.a,{i18nKey:"GAME.LOBBY.ROUND_SELECT.HEADING"},"Lege die Rundenanzahl fest")),c.a.createElement(_.a,null,r))}}]),a}(c.a.Component),Ye=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).state={currentPlayer:{id:localStorage.getItem("playerId")||"",name:localStorage.getItem("playerName")||"",color:Le(localStorage.getItem("playerColor"))},roundDialogOpen:!1},n.addPlayer=n.addPlayer.bind(Object(J.a)(n)),n.setPlayerProps=n.setPlayerProps.bind(Object(J.a)(n)),n.selectNumRounds=n.selectNumRounds.bind(Object(J.a)(n)),n.startPreparation=n.startPreparation.bind(Object(J.a)(n)),n}return Object(H.a)(a,[{key:"setPlayerProps",value:function(e){this.setState({currentPlayer:e})}},{key:"addPlayer",value:function(){var e=Object(V.a)(z.a.mark((function e(t){var a;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ve(this.props.game.id,t);case 2:if(a=e.sent){e.next=5;break}return e.abrupt("return");case 5:this.setLocalPlayer(a);case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"setLocalPlayer",value:function(e){localStorage.setItem("playerId",e.id),localStorage.setItem("playerName",e.name),e.color&&localStorage.setItem("playerColor",e.color),this.props.setTheme&&e.color&&this.props.setTheme(e.color),this.setState({currentPlayer:e})}},{key:"selectNumRounds",value:function(){this.setState({roundDialogOpen:!0})}},{key:"startPreparation",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2;this.setState({roundDialogOpen:!1}),Ne(this.props.game.id,e)}},{key:"render",value:function(){var e=this.props.game,t=this.state,a=t.currentPlayer,n=t.roundDialogOpen,r=localStorage.getItem("playerId")||"",i=!!r&&e.host===r,o=!1,l=e.players.map((function(e){return e.id===r&&(o=!0),c.a.createElement(We,{key:e.id,hint:e.name,color:e.color})})),s=a.name?a.name:"?",u=a.color?a.color:Le();return c.a.createElement("div",{className:"Game-lobby"},c.a.createElement("div",{className:"New-player"},o?c.a.createElement(m.a,{className:"StatusInfo"},c.a.createElement(b.a,{i18nKey:"GAME.LOBBY.WAIT_MESSAGE",tOptions:{context:i?"HOST":"PLAYER"}},"Warten auf Mitspieler ... Sobald alle Mitspieler da sind, kann der Spielleiter das Spiel starten.")):c.a.createElement(Be,{currentPlayer:a,updatePlayer:this.setPlayerProps,addPlayer:this.addPlayer}),i&&o&&c.a.createElement(k.a,{variant:"contained",color:"primary",disabled:e.players.length<3,onClick:this.selectNumRounds},c.a.createElement(b.a,{i18nKey:"GAME.LOBBY.START_BUTTON"},"Alle Spieler sind da"))),c.a.createElement("div",{className:"Player-list"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"COMMON.TEAMMATES"},"Mitspieler")),l,!o&&c.a.createElement(We,{hint:s,color:u,showPencil:!0})),c.a.createElement(xe,{numOfPlayers:e.players.length,open:n,onClose:this.startPreparation}))}}]),a}(c.a.Component),ze=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){return Object(T.a)(this,a),t.apply(this,arguments)}return Object(H.a)(a,[{key:"render",value:function(){var e,t=this.props,a=t.word,n=t.guesser,r=t.color,i=t.isGuesser,o=t.guess,l=t.guessedRight,s=t.showInput,u=t.submitHint,d=n;n?e=o?c.a.createElement(b.a,{i18nKey:"GAME.COMMON.CURRENT_GUESS",tOptions:{context:i?"ME":""}},{guesserName:d},"s    Rateversuch: ",{guess:o}):c.a.createElement(b.a,{i18nKey:"GAME.COMMON.TURN_GUESSING",tOptions:{context:i?"ME":""}},{guesserName:d}," muss raten"):o&&(e=c.a.createElement(b.a,{i18nKey:"GAME.COMMON.GUESS_SPEC"},"Rateversuch: ",{guess:o}));var h=["Word-card"];return o&&(l?h.push("Word-card-correct"):h.push("Word-card-wrong")),c.a.createElement(m.a,{className:h.join(" "),style:{borderColor:r}},s&&u?c.a.createElement(Ie,{submitHint:u,label:re.t("GAME.COMMON.GUESS","Rateversuch")}):c.a.createElement("span",null,a),e&&c.a.createElement("span",{className:"Author-tag",style:{color:r}},e))}}]),a}(c.a.Component),Ve=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).state={words:[]},n.handleChange=n.handleChange.bind(Object(J.a)(n)),n.keyPressed=n.keyPressed.bind(Object(J.a)(n)),n}return Object(H.a)(a,[{key:"handleChange",value:function(e){var t=parseInt(e.target.name.substr(4)),a=e.target.value;this.setState((function(e,n){var r=e.words;return r[t]=a,{words:r}}))}},{key:"keyPressed",value:function(e){if("Enter"===e.key){var t=this.state.words;t.length<this.props.numOfWords||t.some((function(e){return!e||0===e.length}))||this.props.add(t)}}},{key:"render",value:function(){for(var e=this.props,t=e.add,a=e.numOfWords,n=this.state.words,r=[],i=0;i<a;i++){var o=re.t("GAME.PREP.WORD_ADDER.LABEL","Wort "+(i+1),{count:a,index:i+1});r.push(c.a.createElement(q.a,{required:!0,label:o,placeholder:re.t("GAME.PREP.WORD_ADDER.PLACEHOLDER","Ratebegriff eingeben"),name:"word".concat(i),key:"word".concat(i),value:n[i]||"",onChange:this.handleChange,onKeyPress:this.keyPressed}))}var l=n.length<a||n.some((function(e){return!e||0===e.length}));return c.a.createElement("div",{className:"Word-adder"},c.a.createElement(C.a,{variant:"subtitle1"},c.a.createElement(b.a,{i18nKey:"GAME.PREP.WORD_ADDER.HEADING",count:a},"Gib Begriffe f\xfcr das Spiel ein")),r,c.a.createElement(k.a,{variant:"contained",color:"primary",disabled:l,onClick:function(){return t(n)}},c.a.createElement(b.a,{i18nKey:"GAME.PREP.WORD_ADDER.BUTTON",count:a},"Jetzt abschicken")))}}]),a}(c.a.Component),Je=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).currentPlayer={id:localStorage.getItem("playerId")||"",name:localStorage.getItem("playerName")||"",color:Le(localStorage.getItem("playerColor"))},n.addWords=n.addWords.bind(Object(J.a)(n)),n}return Object(H.a)(a,[{key:"addWords",value:function(){var e=Object(V.a)(z.a.mark((function e(t){var a;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(a=this.currentPlayer).enteredWords=t,be(this.props.game.id,a);case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.props.game,a=t.wordsPerPlayer||2,n=localStorage.getItem("playerId")||"",r=!1,i=[],o=!1,l=t.players.map((function(e){var t=!!e.enteredWords&&e.enteredWords.length===a;return e.id===n&&(r=!0,i=e.enteredWords||[],o=t),c.a.createElement(We,{key:e.id,hint:e.name,color:e.color,showPencil:!t})})),s=i.map((function(t){return c.a.createElement(ze,{key:t,word:t,color:e.currentPlayer.color})}));return c.a.createElement("div",{className:"Game-lobby"},c.a.createElement("div",{className:"New-player"},o||!r?c.a.createElement(m.a,{className:"StatusInfo"},c.a.createElement(b.a,{i18nKey:"GAME.PREP.WAIT_MESSAGE"},"Warten auf Mitspieler ... Sobald alle fertig sind, geht's los.")):c.a.createElement(Ve,{add:this.addWords,numOfWords:a}),s.length>0&&c.a.createElement(C.a,{variant:"subtitle1"},c.a.createElement(b.a,{i18nKey:"GAME.PREP.MY_WORDS",count:i.length},"Meine Begriffe")),s),c.a.createElement("div",{className:"Player-list"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"COMMON.TEAMMATES"},"Mitspieler")),l))}}]),a}(c.a.Component),qe=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){return Object(T.a)(this,a),t.apply(this,arguments)}return Object(H.a)(a,[{key:"render",value:function(){var e=this.props.game,t=e.correctWords.map((function(e){return c.a.createElement(ze,{key:e.word,word:e.word,guess:e.guess,guessedRight:!0})})),a=e.wrongWords.map((function(e){return c.a.createElement(ze,{key:e.word,word:e.word,guess:e.guess,guessedRight:!1})}));return c.a.createElement("div",{className:"Game-end-view"},c.a.createElement("div",{className:"Correct-words"},c.a.createElement("h2",null,c.a.createElement(b.a,{i18nKey:"GAME.END.RIGHT",count:e.correctWords.length},"Richtig")),t),c.a.createElement("div",{className:"Wrong-words"},c.a.createElement("h2",null,c.a.createElement(b.a,{i18nKey:"GAME.END.WRONG",count:e.wrongWords.length},"Falsch")),a))}}]),a}(c.a.Component),Fe=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){return Object(T.a)(this,a),t.apply(this,arguments)}return Object(H.a)(a,[{key:"render",value:function(){var e,t=this.props.game,a=(oe(t,t.roundHost)||{name:"?"}).name,n=(oe(t,t.currentGuesser)||{name:"?"}).name;switch(t.phase){case v.HintWriting:var r=t.players.filter((function(e){return t.currentGuesser&&e.id!==t.currentGuesser})).map((function(e){return e.name})),i=r.slice(0,r.length-1).join(", ")+" und "+r[r.length-1];e=c.a.createElement(b.a,{i18nKey:"GAME.STATS.PHASE_WRITING"},{playersString:i}," schreiben Hinweise auf...");break;case v.HintComparing:e=c.a.createElement(b.a,{i18nKey:"GAME.STATS.PHASE_COMPARING"},{roundHostName:a}," \xfcberpr\xfcft die Hinweise ...");break;case v.Guessing:e=c.a.createElement(b.a,{i18nKey:"GAME.STATS.PHASE_GUESSING"},{guesserName:n}," versucht den Begriff zu erraten...");break;case v.Solution:e=t.guessedRight?c.a.createElement(b.a,{i18nKey:"GAME.STATS.PHASE_SOLUTION"},{guesserName:n}," lag genau richtig!"):c.a.createElement(b.a,{i18nKey:"GAME.STATS.PHASE_SOLUTION_WRONG"},{roundHostName:a}," lag daneben! ",{guesserName:n}," entscheidet ob es trotzdem z\xe4hlt...")}var o=t.round+1,l=t.words.length,s=t.correctWords.length,u=t.wrongWords.length;return c.a.createElement("div",{className:"Game-progress"},c.a.createElement("div",null,c.a.createElement(b.a,{i18nKey:"GAME.STATS.ROUND"},"Runde ",{round:o},"/",{roundCount:l}),", ",c.a.createElement(b.a,{i18nKey:"GAME.STATS.RIGHT"},"Richtige: ",{rightCount:s}),", ",c.a.createElement(b.a,{i18nKey:"GAME.STATS.WRONG"},"Falsche: ",{wrongCount:u})),c.a.createElement("div",null,c.a.createElement(b.a,{i18nKey:"GAME.STATS.PHASE"},"Phase"),": ",e))}}]),a}(c.a.Component),Qe=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).submitHint=n.submitHint.bind(Object(J.a)(n)),n}return Object(H.a)(a,[{key:"submitHint",value:function(e){!function(e,t){Ge("".concat(e,"/hint"),{hint:t})}(this.props.game.id,e)}},{key:"render",value:function(){var e=this,t=this.props.game,a=ie(t),n=oe(t,t.currentGuesser)||{name:"?",id:"?"},r=a&&a.id===n.id,i=r?"?":t.currentWord||"",o=t.hints.map((function(n,r){var i=n.hint,o=a&&a.id===n.author,l=oe(t,n.author)||{name:"?",id:"?"},s=o?re.t("COMMON.ME","Ich"):l.name,u=!i||o,m=!i&&o;return c.a.createElement(We,{key:n.author+r,hint:i,color:l.color,showInput:m,submitHint:e.submitHint,showCheck:!u,author:s})}));return c.a.createElement("div",{className:"Game-field"},c.a.createElement("div",{className:"Current-word"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"GAME.COMMON.WORD"},"Begriff")),c.a.createElement(ze,{word:i,guesser:n.name,isGuesser:r,color:n.color})),c.a.createElement("div",{className:"Current-hints"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"GAME.COMMON.PLAYER_HINTS"},"Spieler-Hinweise")),c.a.createElement("div",{className:"WordHint-list"},o)))}}]),a}(c.a.Component),Xe=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).toggleDuplicate=n.toggleDuplicate.bind(Object(J.a)(n)),n.showHints=n.showHints.bind(Object(J.a)(n)),n}return Object(H.a)(a,[{key:"toggleDuplicate",value:function(e){!function(e,t){Ge("".concat(e,"/toggleDuplicateHint"),{hintIndex:t})}(this.props.game.id,e)}},{key:"showHints",value:function(){var e;e=this.props.game.id,Ge("".concat(e,"/showHints"))}},{key:"render",value:function(){var e=this,t=this.props.game,a=ie(t),n=oe(t,t.currentGuesser)||{name:"?",id:"?"},r=a&&a.id===n.id,i=n.name,o=a&&a.id===t.roundHost,l=r?"?":t.currentWord||"",s=t.hints.map((function(n,i){var l=a&&a.id===n.author,s=oe(t,n.author)||{name:"?",id:"?"},u=l?re.t("COMMON.ME","Ich"):s.name;return c.a.createElement(We,{key:n.author+i,hint:n.hint,color:s.color,showCheck:r,duplicate:n.isDuplicate,showDuplicateToggle:o,toggleDuplicate:function(){return e.toggleDuplicate(i)},author:u})}));return c.a.createElement("div",{className:"Game-field"},c.a.createElement("div",{className:"Current-word"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"GAME.COMMON.WORD"},"Begriff")),c.a.createElement(ze,{word:l,guesser:n.name,isGuesser:r,color:n.color})),c.a.createElement("div",{className:"Current-hints"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"GAME.COMMON.PLAYER_HINTS"},"Spieler-Hinweise")),c.a.createElement("div",{className:"WordHint-list"},s),o&&c.a.createElement(C.a,{variant:"subtitle1"},c.a.createElement(b.a,{i18nKey:"GAME.COMPARING.INFO"},"Markiere ung\xfcltige Hinweise")),o&&c.a.createElement(k.a,{variant:"contained",color:"primary",onClick:this.showHints},c.a.createElement(b.a,{i18nKey:"GAME.COMPARING.BUTTON"},{guesserName:i}," kann losraten!"))))}}]),a}(c.a.Component),Ze=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).guess=n.guess.bind(Object(J.a)(n)),n}return Object(H.a)(a,[{key:"guess",value:function(e){!function(e,t){Ge("".concat(e,"/guess"),{guess:t})}(this.props.game.id,e)}},{key:"render",value:function(){var e=this.props.game,t=ie(e),a=oe(e,e.currentGuesser)||{name:"?",id:"?"},n=t&&t.id===a.id,r=n?"?":e.currentWord||"",i=e.hints.map((function(a,r){var i=a.hint,o=t&&t.id===a.author,l=oe(e,a.author)||{name:"?",id:"?"},s=o?re.t("COMMON.ME","Ich"):l.name;return n&&a.isDuplicate&&(i="LEIDER DOPPELT"),c.a.createElement(We,{key:a.author+r,hint:i,color:l.color,duplicate:a.isDuplicate,author:s})}));return c.a.createElement("div",{className:"Game-field"},c.a.createElement("div",{className:"Current-word"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"GAME.COMMON.WORD"},"Begriff")),c.a.createElement(ze,{word:r,guesser:a.name,isGuesser:n,color:a.color,showInput:n,submitHint:this.guess})),c.a.createElement("div",{className:"Current-hints"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"GAME.COMMON.PLAYER_HINTS"},"Spieler-Hinweise")),c.a.createElement("div",{className:"WordHint-list"},i)))}}]),a}(c.a.Component),$e=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(e){var n;return Object(T.a)(this,a),(n=t.call(this,e)).resolveRound=n.resolveRound.bind(Object(J.a)(n)),n}return Object(H.a)(a,[{key:"resolveRound",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];je(this.props.game.id,e)}},{key:"render",value:function(){var e,t=this,a=this.props.game,n=ie(a),r=oe(a,a.currentGuesser)||{name:"?",id:"?"},i=n&&n.id===r.id,o=n&&n.id===a.roundHost,l=a.currentWord||"",s=a.currentGuess||"",u=a.hints.map((function(e,t){var r=n&&n.id===e.author,i=oe(a,e.author)||{name:"?",id:"?"},o=r?re.t("COMMON.ME","Ich"):i.name;return c.a.createElement(We,{key:e.author+t,hint:e.hint,color:i.color,author:o})})),m=c.a.createElement(k.a,{variant:"contained",color:"primary",onClick:function(){return t.resolveRound(!0)}},c.a.createElement(b.a,{i18nKey:"GAME.SOLUTION.CONTINUE"},"Weiter"));return a.guessedRight||(m=c.a.createElement(k.a,{variant:"contained",onClick:function(){return t.resolveRound(!0)}},c.a.createElement(b.a,{i18nKey:"GAME.SOLUTION.CONTINUE_RIGHT"},"Das z\xe4hlt trotzdem")),e=c.a.createElement(k.a,{variant:"contained",color:"primary",onClick:function(){return t.resolveRound(!1)}},c.a.createElement(b.a,{i18nKey:"GAME.SOLUTION.CONTINUE_WRONG"},"Leider falsch"))),c.a.createElement("div",{className:"Game-field"},c.a.createElement("div",{className:"Current-word"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"GAME.COMMON.WORD"},"Begriff")),c.a.createElement(ze,{word:l,guesser:r.name,isGuesser:i,color:r.color,guess:s,guessedRight:a.guessedRight}),(o||a.guessedRight)&&m,o&&e),c.a.createElement("div",{className:"Current-hints"},c.a.createElement(C.a,{variant:"h5"},c.a.createElement(b.a,{i18nKey:"GAME.COMMON.PLAYER_HINTS"},"Spieler-Hinweise")),c.a.createElement("div",{className:"WordHint-list"},u)))}}]),a}(c.a.Component),et=function(e){Object(R.a)(a,e);var t=Object(W.a)(a);function a(){var e;Object(T.a)(this,a);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(e=t.call.apply(t,[this].concat(r))).state={},e._interval=void 0,e._isMounted=!1,e}return Object(H.a)(a,[{key:"componentDidMount",value:function(){this._isMounted=!0,this.loadGame(),this._interval=window.setInterval(this.loadGame.bind(this),1e3)}},{key:"componentWillUnmount",value:function(){this._isMounted=!1,clearInterval(this._interval)}},{key:"loadGame",value:function(){var e=Object(V.a)(z.a.mark((function e(){var t,a;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.gameId,e.next=3,he(t);case 3:if(a=e.sent,this._isMounted){e.next=6;break}return e.abrupt("return");case 6:if(a){e.next=8;break}return e.abrupt("return");case 8:le(a.name),this.setState({currentGame:a});case 10:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e,t,a=this.props.setTheme,n=this.state.currentGame;if(!n)return null;switch(n.phase){case v.Init:e=c.a.createElement(Ye,{game:n,setTheme:a});break;case v.Preparation:e=c.a.createElement(Je,{game:n});break;case v.HintWriting:e=c.a.createElement(Qe,{game:n}),t=c.a.createElement(Fe,{game:n});break;case v.HintComparing:e=c.a.createElement(Xe,{game:n}),t=c.a.createElement(Fe,{game:n});break;case v.Guessing:e=c.a.createElement(Ze,{game:n}),t=c.a.createElement(Fe,{game:n});break;case v.Solution:e=c.a.createElement($e,{game:n}),t=c.a.createElement(Fe,{game:n});break;case v.End:e=c.a.createElement(qe,{game:n})}return c.a.createElement("div",{className:"Game-content"},t,e)}}]),a}(c.a.Component),tt=function(){var e=Object(r.useState)(localStorage.getItem("playerColor")),t=Object(l.a)(e,2),a=t[0],i=t[1],o=Object(r.useState)(localStorage.getItem("darkTheme")||n.AUTO),d=Object(l.a)(o,2),f=d[0],y=d[1],v=Object(E.a)("(prefers-color-scheme: dark)");f===n.BRIGHT?v=!1:f===n.DARK&&(v=!0);var g=a;g&&g.startsWith("#")&&7===g.length||(g="#43a047");var b=c.a.useMemo((function(){return Object(h.a)({palette:{primary:{main:g||"#43a047"},secondary:{main:"#d32f2f"},type:v?"dark":"light"}})}),[v,g]),O=["App"];return v&&O.push("App-dark"),c.a.createElement(s.a,null,c.a.createElement(p.a,{theme:b},c.a.createElement(r.Suspense,{fallback:c.a.createElement(at,null)},c.a.createElement(m.a,{square:!0,elevation:0,className:O.join(" ")},c.a.createElement(x,{userTheme:f,applyUserTheme:function(e){y(e),localStorage.setItem("darkTheme",e)}}),c.a.createElement(u.c,null,c.a.createElement(u.a,{path:"/:gameId",component:function(e){return c.a.createElement(et,{gameId:e.match.params.gameId,setTheme:i})}}),c.a.createElement(u.a,{children:c.a.createElement(Se,null)}))))))},at=function(){return c.a.createElement(m.a,{square:!0,elevation:0,className:"App App-loading"},c.a.createElement(d.a,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(tt,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[112,1,2]]]);
//# sourceMappingURL=main.b5d3e1b9.chunk.js.map