/// <reference path="logbook.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var combat;
(function (combat) {
    load('script/combat/lodash.js');
    var JavaString = Packages.java.lang.String;
    var JavaInteger = Packages.java.lang.Integer;
    var DateTimeString = Packages.logbook.gui.logic.DateTimeString;
    var ShipDto = Packages.logbook.dto.ShipDto;
    var DayPhaseRow = (function () {
        function DayPhaseRow() {
        }
        DayPhaseRow.header = function () {
            var row = PhaseRow.header();
            row.push.apply(row, [
                '自索敵',
                '敵索敵',
                '制空権',
                '会敵',
                '自触接',
                '敵触接',
                '自照明弾',
                '敵照明弾'
            ]);
            return row;
        };
        DayPhaseRow.body = function (battleExDto, phaseDto, phaseApi, itemInfos) {
            var row = PhaseRow.body(battleExDto);
            var sakuteki = battleExDto.getSakuteki();
            if (sakuteki != null) {
                var sakuteki0 = sakuteki[0];
                var sakuteki1 = sakuteki[1];
            }
            row.push(sakuteki0);
            row.push(sakuteki1);
            var phaseDto = battleExDto.getPhase1();
            if (phaseDto != null) {
                var airBattleDto = phaseDto.getAir();
                if (airBattleDto != null) {
                    var seiku = airBattleDto.seiku;
                }
            }
            row.push(seiku);
            row.push(battleExDto.getFormationMatch());
            var touchPlane = phaseDto.getTouchPlane();
            if (touchPlane != null) {
                var touchPlane0 = itemInfos.getName(touchPlane[0]);
                var touchPlane1 = itemInfos.getName(touchPlane[1]);
            }
            row.push(touchPlane0);
            row.push(touchPlane1);
            row.push(null);
            row.push(null);
            return row;
        };
        return DayPhaseRow;
    })();
    combat.DayPhaseRow = DayPhaseRow;
    var NightPhaseRow = (function () {
        function NightPhaseRow() {
        }
        NightPhaseRow.header = function () {
            var row = PhaseRow.header();
            row.push.apply(row, [
                '自索敵',
                '敵索敵',
                '制空権',
                '会敵',
                '自触接',
                '敵触接',
                '自照明弾',
                '敵照明弾'
            ]);
            return row;
        };
        NightPhaseRow.body = function (battleExDto, phaseDto, phaseApi, itemInfos) {
            var row = PhaseRow.body(battleExDto);
            row.push(null);
            row.push(null);
            row.push(null);
            row.push(battleExDto.getFormationMatch());
            var touchPlane = phaseDto.getTouchPlane();
            if (touchPlane != null) {
                var touchPlane0 = itemInfos.getName(touchPlane[0]);
                var touchPlane1 = itemInfos.getName(touchPlane[1]);
            }
            row.push(touchPlane0);
            row.push(touchPlane1);
            var api_flare_pos = phaseApi.api_flare_pos;
            if (api_flare_pos != null) {
                var api_flare_pos0 = api_flare_pos[0];
                if (api_flare_pos0 >= 0) {
                    var flarePos0 = api_flare_pos0;
                }
                var api_flare_pos1 = api_flare_pos[1];
                if (api_flare_pos1 >= 0) {
                    var flarePos1 = api_flare_pos1;
                }
            }
            row.push(flarePos0);
            row.push(flarePos1);
            return row;
        };
        return NightPhaseRow;
    })();
    combat.NightPhaseRow = NightPhaseRow;
    var PhaseRow = (function () {
        function PhaseRow() {
        }
        PhaseRow.header = function () {
            return [
                '日付',
                '海域',
                'マス',
                '出撃',
                'ランク',
                '敵艦隊',
                '提督レベル',
                '自陣形',
                '敵陣形'
            ];
        };
        PhaseRow.body = function (battleExDto) {
            var row = [];
            var battleDate = battleExDto.getBattleDate();
            if (battleDate != null) {
                var battleDateTimeString = new DateTimeString(battleDate);
            }
            row.push(battleDateTimeString);
            row.push(battleExDto.getQuestName());
            var mapCellDto = battleExDto.getMapCellDto();
            if (mapCellDto != null) {
                var reportString = mapCellDto.getReportString();
                var bossTexts = [];
                if (mapCellDto.isStart()) {
                    bossTexts.push('出撃');
                }
                if (mapCellDto.isBoss()) {
                    bossTexts.push('ボス');
                }
                var bossText = bossTexts.join('&');
            }
            row.push(reportString);
            row.push(bossText);
            row.push(battleExDto.getRank());
            row.push(battleExDto.getEnemyName());
            row.push(battleExDto.getHqLv());
            var formation = battleExDto.getFormation();
            if (formation != null) {
                var formation0 = formation[0];
                var formation1 = formation[1];
            }
            row.push(formation0);
            row.push(formation1);
            return row;
        };
        return PhaseRow;
    })();
    combat.PhaseRow = PhaseRow;
    var ItemInfos = (function () {
        function ItemInfos() {
            this.dtos = {};
        }
        ItemInfos.prototype.getName = function (id) {
            var dto = this.dtos[id];
            if (dto != null) {
                return dto.getName();
            }
        };
        return ItemInfos;
    })();
    combat.ItemInfos = ItemInfos;
    var ShipsBase = (function () {
        function ShipsBase(battleExDto, phaseStatus, fleetsStatus) {
            var _this = this;
            this.itemInfos = new ItemInfos();
            var construct = function (shipDtoList, shipHps, shipMaxHps) {
                var shipRows = [];
                for (var i = 0; i < 6; ++i) {
                    shipDto = null;
                    if (shipDtoList != null && i < shipDtoList.length) {
                        var shipDto = shipDtoList[i];
                        if (shipDto != null) {
                            var itemInfoDtos = shipDto.getItem();
                            if (itemInfoDtos != null) {
                                _.forEach(itemInfoDtos, function (itemInfoDto) {
                                    if (itemInfoDto != null) {
                                        _this.itemInfos.dtos[itemInfoDto.getId()] = itemInfoDto;
                                    }
                                });
                            }
                        }
                    }
                    shipRows.push(_this.createShipRow(shipDto, shipHps[i], shipMaxHps[i], i + 1));
                }
                return shipRows;
            };
            var dockDto = battleExDto.getDock();
            if (dockDto != null) {
                this.friendRows = construct(dockDto.getShips(), fleetsStatus.friendHps, phaseStatus.maxFleetsStatus.friendHps);
            }
            var dockCombinedDto = battleExDto.getDockCombined();
            if (dockCombinedDto != null) {
                this.friendCombinedShipRows = construct(dockCombinedDto.getShips(), fleetsStatus.friendCombinedHps, phaseStatus.maxFleetsStatus.friendCombinedHps);
            }
            this.enemyRows = construct(battleExDto.getEnemy(), fleetsStatus.enemyHps, phaseStatus.maxFleetsStatus.enemyHps);
        }
        return ShipsBase;
    })();
    combat.ShipsBase = ShipsBase;
    var Ships = (function (_super) {
        __extends(Ships, _super);
        function Ships(battleExDto, phaseStatus, fleetsStatus) {
            _super.call(this, battleExDto, phaseStatus, fleetsStatus);
        }
        Ships.prototype.createShipRow = function (shipBaseDto, hp, maxHp, index) {
            return ShipRow.body(shipBaseDto, hp, maxHp, index);
        };
        return Ships;
    })(ShipsBase);
    combat.Ships = Ships;
    var ShipRow = (function () {
        function ShipRow() {
        }
        ShipRow.header = function () {
            var row = [
                '編成順',
                'ID',
                '名前',
                '種別',
                '疲労',
                '残耐久',
                '最大耐久',
                '損傷',
                '残燃料',
                '最大燃料',
                '残弾薬',
                '最大弾薬',
                'Lv',
                '速力',
                '火力',
                '雷装',
                '対空',
                '装甲',
                '回避',
                '対潜',
                '索敵',
                '運',
                '射程'
            ];
            row.push.apply(row, ItemRow.header());
            return row;
        };
        ShipRow.body = function (shipBaseDto, hp, maxHp, index) {
            if (shipBaseDto != null) {
                var row = [];
                var shipInfoDto = shipBaseDto.getShipInfo();
                if (shipInfoDto != null) {
                    var shipId = shipInfoDto.getShipId();
                    var fullName = shipInfoDto.getFullName();
                    var type = shipInfoDto.getType();
                    var maxFuel = shipInfoDto.getMaxFuel();
                    var maxBull = shipInfoDto.getMaxBull();
                }
                if (shipBaseDto instanceof ShipDto) {
                    var shipDto = shipBaseDto;
                    var cond = shipDto.getCond();
                    var fuel = shipDto.getFuel();
                    var bull = shipDto.getBull();
                }
                var shipParamDto = shipBaseDto.getParam();
                if (shipParamDto != null) {
                    switch (shipParamDto.getSoku()) {
                        case 0:
                            var soku = '陸上';
                            break;
                        case 5:
                            var soku = '低速';
                            break;
                        case 10:
                            var soku = '高速';
                            break;
                    }
                    var houg = shipParamDto.getHoug();
                    var raig = shipParamDto.getRaig();
                    var taik = shipParamDto.getTaik();
                    var souk = shipParamDto.getSouk();
                    var kaih = shipParamDto.getKaih();
                    var tais = shipParamDto.getTais();
                    var saku = shipParamDto.getSaku();
                    var luck = shipParamDto.getLuck();
                    switch (shipParamDto.getLeng()) {
                        case 0:
                            var leng = '超短';
                            break;
                        case 1:
                            var leng = '短';
                            break;
                        case 2:
                            var leng = '中';
                            break;
                        case 3:
                            var leng = '長';
                            break;
                        case 4:
                            var leng = '超長';
                            break;
                    }
                }
                var lv = shipBaseDto.getLv();
                var hpRate = 4 * hp / maxHp;
                if (hpRate > 3) {
                    var hpText = '小破未満';
                }
                else if (hpRate > 2) {
                    var hpText = '小破';
                }
                else if (hpRate > 1) {
                    var hpText = '中破';
                }
                else if (hpRate > 0) {
                    var hpText = '大破';
                }
                else {
                    var hpText = '轟沈';
                }
                row.push(JavaInteger.valueOf(index));
                row.push(shipId);
                row.push(fullName);
                row.push(type);
                row.push(cond);
                row.push(hp);
                row.push(maxHp);
                row.push(hpText);
                row.push(fuel);
                row.push(maxFuel);
                row.push(bull);
                row.push(maxBull);
                row.push(lv);
                row.push(soku);
                row.push(houg);
                row.push(raig);
                row.push(taik);
                row.push(souk);
                row.push(kaih);
                row.push(tais);
                row.push(saku);
                row.push(luck);
                row.push(leng);
                row.push.apply(row, ItemRow.body(shipBaseDto));
                return row;
            }
            else {
                return new Array(this.header().length);
            }
        };
        return ShipRow;
    })();
    combat.ShipRow = ShipRow;
    var ItemRow = (function () {
        function ItemRow() {
        }
        ItemRow.header = function () {
            var row = [];
            for (var i = 1; i <= 5; ++i) {
                row.push.apply(row, _.map([
                    '名前',
                    '改修',
                    '熟練度',
                    '搭載数'
                ], function (s) { return ('装備' + i + '.' + s); }));
            }
            return row;
        };
        ItemRow.body = function (shipBaseDto) {
            var construct = function (itemDto, itemInfoDto, onSlot) {
                if (itemInfoDto != null) {
                    var name = itemInfoDto.getName();
                    var level = (itemDto != null) ? itemDto.getLevel() : null;
                    var alv = (itemDto != null) ? itemDto.getAlv() : null;
                }
                return [
                    name,
                    level,
                    alv,
                    onSlot
                ];
            };
            var row = [];
            if (shipBaseDto != null) {
                if (shipBaseDto instanceof ShipDto) {
                    var shipDto = (shipBaseDto);
                    var itemDtos = shipDto.getItem2();
                    var itemExDto = shipDto.getSlotExItem();
                    if (itemExDto != null) {
                        var itemInfoExDto = itemExDto.getInfo();
                    }
                }
                var itemInfoDtos = shipBaseDto.getItem();
                var onSlots = shipBaseDto.getOnSlot();
            }
            for (var i = 0; i < 5; ++i) {
                if (i === 4 && itemExDto != null && itemInfoExDto != null) {
                    var itemRow = construct(itemExDto, itemInfoExDto, null);
                }
                else if (itemInfoDtos != null && i < itemInfoDtos.length) {
                    if (onSlots != null && i < onSlots.length) {
                        var onSlot = onSlots[i];
                    }
                    if (itemDtos != null && i < itemDtos.length) {
                        var itemRow = construct(itemDtos[i], itemInfoDtos[i], onSlot);
                    }
                    else {
                        var itemRow = construct(null, itemInfoDtos[i], onSlot);
                    }
                }
                else {
                    var itemRow = construct(null, null, null);
                }
                row.push.apply(row, itemRow);
            }
            return row;
        };
        return ItemRow;
    })();
    combat.ItemRow = ItemRow;
    var PhaseStatus = (function () {
        function PhaseStatus(battleExDto, phaseDto) {
            this.maxFleetsStatus = new FleetsStatus(battleExDto.getMaxFriendHp(), battleExDto.getMaxFriendHpCombined(), battleExDto.getMaxEnemyHp());
            var phase1Dto = battleExDto.getPhase1();
            var phase2Dto = battleExDto.getPhase2();
            if (phaseDto === phase1Dto) {
                var fleetsStatus = new FleetsStatus(battleExDto.getStartFriendHp(), battleExDto.getStartFriendHpCombined(), battleExDto.getStartEnemyHp());
            }
            else if (phaseDto === phase2Dto) {
                var fleetsStatus = new FleetsStatus(phase1Dto.getNowFriendHp(), phase1Dto.getNowFriendHpCombined(), phase1Dto.getNowEnemyHp());
            }
            this.firstFleetsStatus = fleetsStatus;
            this.airFleetsStatus = fleetsStatus.updateAir(phaseDto.getAir());
            this.supportFleetsStatus = fleetsStatus.update(phaseDto.getSupport());
            this.openingFleetsStatus = fleetsStatus.update(phaseDto.getOpening());
            this.air2FleetsStatus = fleetsStatus.updateAir(phaseDto.getAir2());
            this.hougeki1FleetsStatusList = fleetsStatus.updateHougeki(phaseDto.getHougeki1());
            if (phaseDto.getKind().isHougeki1Second()) {
                this.raigekiFleetsStatus = fleetsStatus.update(phaseDto.getRaigeki());
                this.hougeki2FleetsStatusList = fleetsStatus.updateHougeki(phaseDto.getHougeki2());
                this.hougeki3FleetsStatusList = fleetsStatus.updateHougeki(phaseDto.getHougeki3());
            }
            else {
                this.hougeki2FleetsStatusList = fleetsStatus.updateHougeki(phaseDto.getHougeki2());
                this.hougeki3FleetsStatusList = fleetsStatus.updateHougeki(phaseDto.getHougeki3());
                this.raigekiFleetsStatus = fleetsStatus.update(phaseDto.getRaigeki());
            }
            this.hougekiFleetsStatusList = fleetsStatus.updateHougeki(phaseDto.getHougeki());
            this.lastFleetsStatus = fleetsStatus;
        }
        return PhaseStatus;
    })();
    combat.PhaseStatus = PhaseStatus;
    var FleetsStatus = (function () {
        function FleetsStatus(friendHps, friendCombinedHps, enemyHps) {
            if (friendHps != null) {
                this.friendHps = _.map(friendHps, function (hp) { return hp; });
            }
            else {
                this.friendHps = [];
            }
            if (friendCombinedHps != null) {
                this.friendCombinedHps = _.map(friendCombinedHps, function (hp) { return hp; });
            }
            else {
                this.friendCombinedHps = [];
            }
            if (enemyHps != null) {
                this.enemyHps = _.map(enemyHps, function (hp) { return hp; });
            }
            else {
                this.enemyHps = [];
            }
        }
        FleetsStatus.prototype.clone = function () {
            return new FleetsStatus(this.friendHps, this.friendCombinedHps, this.enemyHps);
        };
        FleetsStatus.prototype.update = function (battleAtackDtoList) {
            var _this = this;
            var previous = this.clone();
            if (battleAtackDtoList != null) {
                _.forEach(battleAtackDtoList, function (battleAtackDto) {
                    _.forEach(battleAtackDto.target, function (t, i) {
                        if (battleAtackDto.friendAtack) {
                            _this.enemyHps[t] = Math.max(0, _this.enemyHps[t] - battleAtackDto.damage[i]);
                        }
                        else {
                            if (t < 6) {
                                _this.friendHps[t] = Math.max(0, _this.friendHps[t] - battleAtackDto.damage[i]);
                            }
                            else {
                                _this.friendCombinedHps[t - 6] = Math.max(0, _this.friendCombinedHps[t - 6] - battleAtackDto.damage[i]);
                            }
                        }
                    });
                });
            }
            return previous;
        };
        FleetsStatus.prototype.updateAir = function (airBattleDto) {
            if (airBattleDto != null) {
                return this.update(airBattleDto.atacks);
            }
            else {
                return this.update(null);
            }
        };
        FleetsStatus.prototype.updateHougeki = function (battleAtackDtoList) {
            var _this = this;
            if (battleAtackDtoList != null) {
                return _.map(battleAtackDtoList, function (battleAtackDto) {
                    return _.map(battleAtackDto.target, function (t, i) {
                        var previous = _this.clone();
                        if (battleAtackDto.friendAtack) {
                            _this.enemyHps[t] = Math.max(0, _this.enemyHps[t] - battleAtackDto.damage[i]);
                        }
                        else {
                            if (t < 6) {
                                _this.friendHps[t] = Math.max(0, _this.friendHps[t] - battleAtackDto.damage[i]);
                            }
                            else {
                                _this.friendCombinedHps[t - 6] = Math.max(0, _this.friendCombinedHps[t - 6] - battleAtackDto.damage[i]);
                            }
                        }
                        return previous;
                    });
                });
            }
        };
        return FleetsStatus;
    })();
    combat.FleetsStatus = FleetsStatus;
    // javascriptの配列をそのまま返すと遅いので
    // Comparable[]に変換しておく
    // undefinedはnullに変換される
    function toComparable(sourceRows) {
        var ComparableType = Java.type('java.lang.Comparable');
        var ComparableArrayType = Java.type('java.lang.Comparable[]');
        var ComparableArrayArrayType = Java.type('java.lang.Comparable[][]');
        var targetRows = new ComparableArrayArrayType(sourceRows.length);
        for (var j = 0; j < sourceRows.length; ++j) {
            var sourceRow = sourceRows[j];
            var targetRow = new ComparableArrayType(sourceRow.length);
            for (var i = 0; i < sourceRow.length; ++i) {
                var source = sourceRow[i];
                if (source == null) {
                    targetRow[i] = null;
                }
                else if (source instanceof ComparableType) {
                    targetRow[i] = source;
                }
                else {
                    targetRow[i] = JavaString.valueOf(source);
                }
            }
            targetRows[j] = targetRow;
        }
        return targetRows;
    }
    combat.toComparable = toComparable;
})(combat || (combat = {}));
/// <reference path="../combat/combat.ts" />
var combat;
(function (combat) {
    var JavaInteger = Packages.java.lang.Integer;
    var HougekiTable = (function () {
        function HougekiTable() {
        }
        HougekiTable.header = function () {
            return HougekiRow.header();
        };
        HougekiTable.body = function (battleExDto) {
            var rows = [];
            var phaseDto = battleExDto.getPhase1();
            if (phaseDto != null) {
                var phaseKindDto = phaseDto.getKind();
                if (phaseKindDto != null) {
                    if (!phaseKindDto.isNight()) {
                        var phaseJson = phaseDto.getJson();
                        if (phaseJson != null) {
                            var phaseApi = JSON.parse(phaseJson.toString());
                            if (phaseApi != null) {
                                var phaseStatus = new combat.PhaseStatus(battleExDto, phaseDto);
                                rows.push.apply(rows, HougekiRow.body(battleExDto, phaseStatus, phaseDto, phaseApi, 1));
                                rows.push.apply(rows, HougekiRow.body(battleExDto, phaseStatus, phaseDto, phaseApi, 2));
                                rows.push.apply(rows, HougekiRow.body(battleExDto, phaseStatus, phaseDto, phaseApi, 3));
                            }
                        }
                    }
                }
            }
            return combat.toComparable(rows);
        };
        return HougekiTable;
    })();
    combat.HougekiTable = HougekiTable;
    var HougekiRow = (function () {
        function HougekiRow() {
        }
        HougekiRow.header = function () {
            var row = _.clone(combat.DayPhaseRow.header());
            row.push.apply(row, [
                '戦闘種別',
                '自艦隊',
                '巡目',
                '攻撃艦',
                '砲撃種別',
                '表示装備1',
                '表示装備2',
                '表示装備3',
                'クリティカル',
                'ダメージ',
                'かばう'
            ]);
            row.push.apply(row, _.map(combat.ShipRow.header(), function (s) { return ('攻撃艦.' + s); }));
            row.push.apply(row, _.map(combat.ShipRow.header(), function (s) { return ('防御艦.' + s); }));
            return row;
        };
        HougekiRow.body = function (battleExDto, phaseStatus, phaseDto, phaseApi, hougekiIndex) {
            var kindDto = phaseDto.getKind();
            var isHougeki1Second = kindDto.isHougeki1Second();
            var isHougeki2Second = kindDto.isHougeki2Second();
            var isHougeki3Second = kindDto.isHougeki3Second();
            if (hougekiIndex === 1) {
                var fleetStatusList = phaseStatus.hougeki1FleetsStatusList;
                var api_hougeki = phaseApi.api_hougeki1;
                var isSecond = isHougeki1Second;
            }
            else if (hougekiIndex === 2) {
                var fleetStatusList = phaseStatus.hougeki2FleetsStatusList;
                var api_hougeki = phaseApi.api_hougeki2;
                var isSecond = isHougeki2Second;
            }
            else if (hougekiIndex === 3) {
                var fleetStatusList = phaseStatus.hougeki3FleetsStatusList;
                var api_hougeki = phaseApi.api_hougeki3;
                var isSecond = isHougeki3Second;
            }
            if (battleExDto.isCombined()) {
                if (isSecond) {
                    var fleetName = '連合第2艦隊';
                }
                else {
                    var fleetName = '連合第1艦隊';
                }
            }
            else {
                var fleetName = '通常艦隊';
            }
            if (isSecond === isHougeki1Second) {
                var hougekiCount = hougekiIndex;
            }
            else {
                var hougekiCount = hougekiIndex - 1;
            }
            var rows = [];
            if (api_hougeki != null) {
                for (var i = 1; i < api_hougeki.api_at_list.length; ++i) {
                    var api_at = api_hougeki.api_at_list[i];
                    var api_at_type = api_hougeki.api_at_type[i];
                    var api_df_list = api_hougeki.api_df_list[i];
                    var api_si_list = api_hougeki.api_si_list[i];
                    var api_cl_list = api_hougeki.api_cl_list[i];
                    var api_damage = api_hougeki.api_damage[i];
                    for (var j = 0; j < api_df_list.length; ++j) {
                        var ships = new combat.Ships(battleExDto, phaseStatus, fleetStatusList[i - 1][j]);
                        var phaseRow = combat.DayPhaseRow.body(battleExDto, phaseDto, phaseApi, ships.itemInfos);
                        if (isSecond) {
                            var friendShips = battleExDto.getDockCombined().getShips();
                            var friendShipRows = ships.friendCombinedShipRows;
                        }
                        else {
                            var friendShips = battleExDto.getDock().getShips();
                            var friendShipRows = ships.friendRows;
                        }
                        var enemyShips = battleExDto.getEnemy();
                        var enemyShipRows = ships.enemyRows;
                        if (api_at < 7) {
                            var itemInfoDtos = friendShips[api_at - 1].getItem();
                            var atackFleetName = '自軍';
                        }
                        else {
                            var itemInfoDtos = battleExDto.getEnemy()[api_at - 7].getItem();
                            var atackFleetName = '敵軍';
                        }
                        var itemNames = _.map(api_si_list, function (api_si) {
                            var itemDto = _.find(itemInfoDtos, function (itemInfoDto) { return itemInfoDto != null ? itemInfoDto.getId() == api_si : false; });
                            if (itemDto != null) {
                                return itemDto.getName();
                            }
                            else {
                                return null;
                            }
                        });
                        var api_df = api_df_list[j];
                        var damage = JavaInteger.valueOf(api_damage[j]);
                        var row = _.clone(phaseRow);
                        row.push.apply(row, [
                            '砲撃戦',
                            fleetName,
                            hougekiCount,
                            atackFleetName,
                            api_at_type,
                            itemNames[0],
                            itemNames[1],
                            itemNames[2],
                            JavaInteger.valueOf(api_cl_list[j]),
                            damage,
                            damage != api_damage[j] ? 1 : 0
                        ]);
                        if (api_at < 7) {
                            row.push.apply(row, friendShipRows[api_at - 1]);
                        }
                        else {
                            row.push.apply(row, ships.enemyRows[api_at - 7]);
                        }
                        if (api_df < 7) {
                            row.push.apply(row, friendShipRows[api_df - 1]);
                        }
                        else {
                            row.push.apply(row, ships.enemyRows[api_df - 7]);
                        }
                        rows.push(row);
                    }
                }
            }
            return rows;
        };
        return HougekiRow;
    })();
    combat.HougekiRow = HougekiRow;
})(combat || (combat = {}));
function begin() {
}
function end() {
}
function header() {
    return combat.HougekiTable.header();
}
function body(battleExDto) {
    return combat.HougekiTable.body(battleExDto);
}
