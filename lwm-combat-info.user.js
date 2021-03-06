// ==UserScript==
// @name            LWM Combat Info
// @name:ru         HWM Combat Info
// @namespace       https://greasyfork.org/en/users/731199-thirdwater
// @description     Displays extra information during combats
// @description:ru  Displays extra information during combats
// @match           *://www.lordswm.com/war.php?*
// @match           *://www.heroeswm.ru/war.php?*
// @run-at          document-end
// @grant           none
// @version         0.1
// ==/UserScript==


/*global $ */ // So we can use easyTooltip.js (and also get jQuery for free)
(function($) {

    'use strict';

    function main() {
        // LWM Combat Info script

        /*
         * Config
         */
        var text = {
            stack_size: {
                en: function(current, max) {
                    return "Stack size: " + current + "/" + max;
                },
                ru: function(current, max) {
                    return "Stack size: " + current + "/" + max;
                },
            },
            stack_hp: {
                en: function(current, max) {
                    return "Total hit points: " + current + "/" + max;
                },
                ru: function(current, max) {
                    return "Total hit points: " + current + "/" + max;
                },
            },
            stack_initiative: {
                en: function(atb_position) {
                    return "ATB position: " + atb_position;
                },
                ru: function(atb_position) {
                    return "ATB position: " + atb_position;
                },
            },
            hero_factions: {
                en: function(factions) {
                    return "lorem ipsum";
                },
                ru: function(factions) {
                    return "lorem ipsum";
                },
            },
            hero_level: {
                en: function(ap) {
                    return "AP: " + ap;
                },
                ru: function(ap) {
                    return "AP: " + ap;
                },
            },
            hero_initiative: {
                en: function(atb_position) {
                    return "ATB position: " + atb_position;
                },
                ru: function(atb_position) {
                    return "ATB position: " + atb_position;
                },
            },
        };
        var lwm_interface = {
            domain: {
                en: "https://www.lordswm.com/",
                ru: "https://www.heroeswm.ru/",
            },
            tooltip_class: 'for_tooltip',
            get_tooltip_description_container: function() {
                return document.getElementById('caster_desc').parentNode;
            },
            /*global war_scr */
            stack_object: window.stage[war_scr].obj,
            get_current_stack: function() {
                /*global cur_unit_info */
                var stack_id = cur_unit_info;
                return lwm_interface.stack_object[stack_id];
            },
            event_source: [
                document.getElementById(war_scr),
                document.getElementById('btn_effects_info'),
                document.getElementById('btn_effects_info_hero'),
                document.getElementById('btn_effects_info_creature'),
            ],
            hero_info_element: document.getElementById('win_InfoHero'),
            unit_info_element: document.getElementById('win_InfoCreature'),
            effect_info_element: document.getElementById('win_InfoCreatureEffect'),
            get_stack_size_element: function(page) {
                if (page === 1) {
                    return document.getElementById('cre_info_head').children[0].children[0];
                } else if (page === 2) {
                    return document.getElementById('effects_info_head').children[0].children[0];
                }
            },
            get_creature_name_node: function(page) {
                if (page === 1) {
                    return document.getElementById('cre_info_head').children[0].firstChild;
                } else if (page === 2) {
                    return document.getElementById('effects_info_head').children[0].firstChild;
                }
            },
            stack_hp_element: document.getElementById('cre_info_health').parentNode,
            stack_initiative_element: document.getElementById('cre_info_init').parentNode,
            get_hero_factions_element: function(page) {
                if (page === 1) {
                    return document.getElementById('hero_info_head').firstChild;
                } else if (page === 2) {
                    return document.getElementById('effects_info_head').firstChild;
                }
            },
            get_hero_level_element: function(page) {
                if (page === 1) {
                    return document.getElementById('hero_info_head').lastChild;
                } else if (page === 2) {
                    return document.getElementById('effects_info_head').lastChild;
                }
            },
            hero_initiative_element: document.getElementById('hero_info_init').parentNode,
            creature_infocard_page: 'army_info.php?name=',
            // Potential bug; need to find all creatures with different combat/infocard names.
            creature_infocard_name: {
                // We only store the creatures with different code names for combat and infocard.
                // Knight
                'paesant': 'peasant',
                'crossbowman': 'crossman',
                'swordman': 'squire',
                'knight': 'cavalier',
                // Necromancer
                'sceleton': 'skeleton',
                'sceletonarcher': 'skeletonarcher',
                // Wizard
                'gargoly': 'stone_gargoyle',
                'golem': 'iron_golem',
                'rakshas': 'rakshasa_rani',
                // Elf
                'pp': 'pixel',
                'dryad_': 'dryad',
                'bladedancer': 'wardancer',
                'winddancer': 'wdancer',
                'hunterelf': 'masterhunter',
                'dd_': 'druid',
                'ddeld': 'druideld',
                // Barbarian
                'hobwolfrider': 'wolfraider',
                'roc': 'rocbird',
                'firebird_': 'firebird',
                'cyclopod_': 'cyclopod',
                'cyclopshaman': 'shamancyclop',
                'abehemoth': 'ancientbehemoth',
                'bbehemoth': 'cursedbenemoth',
                // Dark Elf
                'minotaurguard_': 'minotaurguard',
                'lizardrider': 'darkrider',
                'witch': 'shadow_witch',
                // Demon
                'hdemon': 'horneddemon',
                'fdemon': 'hornedoverseer',
                'demondog': 'hellhound',
                'firehound': 'hotdog',
                'succub': 'succubus',
                'succubusm': 'succubusmis',
                'nightmare': 'hellcharger',
                'stallion': 'nightmare',
                'hellstallion': 'hellkon',
                'pitfiend_': 'pitfiend',
                'pitlord_': 'pitlord',
                'pitspawn': 'pity',
                // Pharaoh
                'zhrica': 'priestmoon',
                'zhricaup': 'priestsun',
            },
        };
        var tooltip = {
            stack_size: {
                class: 'stack_size_tooltip',
                description_id: 'stack_size_desc',
            },
            stack_hp: {
                class: 'stack_hp_tooltip',
                description_id: 'stack_hp_desc',
            },
            stack_initiative: {
                class: 'stack_initiative_tooltip',
                description_id: 'stack_initiative_desc',
            },
            hero_factions: {
                class: 'hero_factions_tooltip',
                description_id: 'hero_factions_desc',
            },
            hero_level: {
                class: 'hero_level_tooltip',
                description_id: 'hero_level_desc',
            },
            hero_initiative: {
                class: 'hero_initiative_tooltip',
                description_id: 'hero_initiative_desc',
            },
        };

        /*
         * Utilities
         */
        function is_visible(element) {
            // Note element.style.display only works for explicit display in the style attribute.
            return window.getComputedStyle(element).display !== 'none';
        }
        function is_hero(stack) {
            return stack.hero !== undefined;
        }

        /*
         * Tooltips
         */
        function addEasyTooltip(component) {
            $('.' + component.class).easyTooltip({
                useElement: component.description_id,
            });
        }
        function add_tooltip_descriptions() {
            var container_element = lwm_interface.get_tooltip_description_container();
            for (var component in tooltip) {
                var description_id = tooltip[component].description_id;
                var description_element = document.createElement('div');
                description_element.id = description_id;
                description_element.style = 'display: none;';
                container_element.append(description_element);
            }
        }
        function add_static_tooltip_components() {
            var stack_hp_element = lwm_interface.stack_hp_element;
            stack_hp_element.classList.add(lwm_interface.tooltip_class);
            stack_hp_element.classList.add(tooltip.stack_hp.class);
            addEasyTooltip(tooltip.stack_hp);

            var stack_initiative_element = lwm_interface.stack_initiative_element;
            stack_initiative_element.classList.add(lwm_interface.tooltip_class);
            stack_initiative_element.classList.add(tooltip.stack_initiative.class);
            addEasyTooltip(tooltip.stack_initiative);

            var hero_initiative_element = lwm_interface.hero_initiative_element;
            hero_initiative_element.classList.add(lwm_interface.tooltip_class);
            hero_initiative_element.classList.add(tooltip.hero_initiative.class);
            addEasyTooltip(tooltip.hero_initiative);
        }
        // Some elements are being added/modified/removed by the LWM scripts on the fly,
        // so we have to re-apply these tooltips whenever appropriate.
        function add_stack_size_tooltip(page) {
            var stack_size_element = lwm_interface.get_stack_size_element(page);
            if (stack_size_element === undefined) {
                return;
            }
            stack_size_element.classList.add(lwm_interface.tooltip_class);
            stack_size_element.classList.add(tooltip.stack_size.class);
            addEasyTooltip(tooltip.stack_size);
        }
        function add_creature_link(page, stack) {
            var creature_name_node = lwm_interface.get_creature_name_node(page);
            var combat_name = stack.filename.slice(0, -3); // see also: anim and lname
            var infocard_name = combat_name;
            if (combat_name in lwm_interface.creature_infocard_name) {
                infocard_name = lwm_interface.creature_infocard_name[combat_name];
            }

            var link_element = document.createElement('a');
            link_element.innerHTML = creature_name_node.textContent;
            link_element.target = '_blank';
            link_element.href = lwm_interface.domain.en + lwm_interface.creature_infocard_page + infocard_name;
            creature_name_node.replaceWith(link_element);
        }
        function add_hero_factions_tooltip(page) {
            var hero_factions_element = lwm_interface.get_hero_factions_element(page);
            hero_factions_element.classList.add(lwm_interface.tooltip_class);
            hero_factions_element.classList.add(tooltip.hero_factions.class);
            addEasyTooltip(tooltip.hero_factions);
        }
        function add_hero_level_tooltip(page) {
            var hero_level_element = lwm_interface.get_hero_level_element(page);
            hero_level_element.classList.add(lwm_interface.tooltip_class);
            hero_level_element.classList.add(tooltip.hero_level.class);
            addEasyTooltip(tooltip.hero_level);
        }

        /*
         * Data
         */
        function update_hero_factions(stack) {
            var factions = "foo";
            // get window.umelka (indexed by pl_id)
            // get player id to find matching pl_id to lookup the umelka
            // window.params
            // window.pl_ids
            // window.player..
            var description = document.getElementById(tooltip.hero_factions.description_id);
            description.innerHTML = text.hero_factions.en(factions);
        }
        function update_hero_level(stack) {
            var ap = parseInt(stack.data_string.match(/exp[\d]+/)[0].slice(4));
            if (!ap) {
                ap = 0;
            }
            var description = document.getElementById(tooltip.hero_level.description_id);
            description.innerHTML = text.hero_level.en(ap);
        }
        function update_hero_initiative(stack) {
            var atb_position = stack.nowinit;
            var description = document.getElementById(tooltip.hero_initiative.description_id);
            description.innerHTML = text.hero_initiative.en(atb_position);
        }
        // Bug during settlement:
        // Splitted stacks will still have their original max stack size before the split.
        function update_stack_size(stack) {
            var max_stack_size = stack.maxnumber;
            var current_stack_size = stack.nownumber;

            var description = document.getElementById(tooltip.stack_size.description_id);
            description.innerHTML = text.stack_size.en(current_stack_size, max_stack_size);
        }
        function update_stack_hp(stack) {
            var max_stack_size = stack.maxnumber;
            var current_stack_size = stack.nownumber;
            var original_max_hp = stack.realhealth;
            var reduced_max_hp = stack.maxhealth;
            var current_hp = stack.nowhealth;

            var stack_original_max_hp = max_stack_size * original_max_hp;
            var stack_current_hp_base = (current_stack_size - 1) * reduced_max_hp;
            var stack_current_hp_head = current_hp;
            var stack_current_hp = stack_current_hp_base + stack_current_hp_head;

            var description = document.getElementById(tooltip.stack_hp.description_id);
            description.innerHTML = text.stack_hp.en(stack_current_hp, stack_original_max_hp);
        }
        function update_stack_initiative(stack) {
            var atb_position = stack.nowinit;
            var description = document.getElementById(tooltip.stack_initiative.description_id);
            description.innerHTML = text.stack_initiative.en(atb_position);
        }

        /*
         * Event Handling
         */
        function on_hero_info(stack) {
            update_hero_factions(stack);
            update_hero_level(stack);
        }
        function on_hero_info_page1(stack) {
            add_hero_factions_tooltip(1);
            add_hero_level_tooltip(1);
            update_hero_initiative(stack);
        }
        function on_hero_info_page2(stack) {
            add_hero_factions_tooltip(2);
            add_hero_level_tooltip(2);
        }
        function on_unit_info(stack) {
            update_stack_size(stack);
        }
        function on_unit_info_page1(stack) {
            add_stack_size_tooltip(1);
            add_creature_link(1, stack);
            update_stack_hp(stack);
            update_stack_initiative(stack);
        }
        function on_unit_info_page2(stack) {
            add_stack_size_tooltip(2);
            add_creature_link(2, stack);
        }
        function dispatch_event(event) {
            var stack = lwm_interface.get_current_stack();
            if (!stack) {
                return;
            }
            if (is_hero(stack)) {
                on_hero_info(stack);
            } else {
                on_unit_info(stack);
            }
            if (is_visible(lwm_interface.hero_info_element)) {
                on_hero_info_page1(stack);
            } else if (is_visible(lwm_interface.unit_info_element)) {
                on_unit_info_page1(stack);
            } else if (is_visible(lwm_interface.effect_info_element)) {
                if (is_hero(stack)) {
                    on_hero_info_page2(stack);
                } else {
                    on_unit_info_page2(stack);
                }
            }
        }
        function on_trigger(event) {
            // Wait a bit for LWM script to update the windows.
            setTimeout(function() {
                dispatch_event(event);
            }, 100);
        }

        /*
         * Main Setup
         */
        add_tooltip_descriptions();
        add_static_tooltip_components();
        lwm_interface.event_source.forEach(function(source, index) {
            source.addEventListener('mouseup', on_trigger);
        });

    }

    // Inject main into the document so we can access window attributes defined by LWM.
    // See: https://stackoverflow.com/a/10828021/
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.textContent = "window.addEventListener('load', " + main.toString() + ", false);";
    document.body.appendChild(script);

})($);
