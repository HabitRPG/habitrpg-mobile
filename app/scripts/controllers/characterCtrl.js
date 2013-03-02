'use strict';

/**
 * The character controller:
 *
 */

habitrpg.controller( 'CharacterCtrl', function CharacterCtrl( $scope, characterStorage, $location, filterFilter, characterData, userData, userStorage ) {



    $scope.newCharacter = function() {

        var characterSchema = {

            stats : { gp:0, exp:0, lvl:1, hp:50          },
            party : { current:null, invitation:null      },
            items : { weapon:0, armor:0, head:0, shield:0},
            preferences: { gender: 'm', skin: 'white', hair: 'blond', armorSet: 'v1' },
            habitIds : [],
            dailyIds : [],
            todoIds  : [],
            rewardIds: [],
            apiToken : null,
            lastCron: 'new',
            balance  : 1,
            flags: { partyEnabled:false, itemsEnabled:false, kickstarter:'show'}

        }

        characterStorage.put(characterSchema);

    }

    $scope.updateCharacter  = function(character) {

        characterData.setData(character)
        characterStorage.put(character);


    }

    $scope.submit = function() {

       character.stats.hp = character.stats.hp + 20;
       $scope.updateCharacter(character)

    }

    var character = $scope.character = characterStorage.get()



    if (character.length == 0) { 

        $scope.newCharacter()

        character = $scope.character = characterStorage.get()

    }

    var user = $scope.user = userStorage.get()


    characterData.setData(character)
    userData.setData(user)

    $scope.m_armor  = character.items.armor;
    $scope.m_head   = character.items.head;
    $scope.m_shield = character.items.shield;
    $scope.m_weapon = character.items.weapon;
    $scope.m_skin   = character.preferences.skin;
    $scope.m_color  = character.preferences.hair;




});
