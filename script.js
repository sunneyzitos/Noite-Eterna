document.addEventListener('DOMContentLoaded', () => {
    // Character selection handling
    const characterSelect = document.getElementById('character-name');
    characterSelect.addEventListener('change', (e) => {
        // Remove all existing theme classes
        document.body.classList.remove('theme-magnus', 'theme-ravi', 'theme-sergio', 'theme-roger');
        
        // Add the new theme class if a character is selected
        if (e.target.value) {
            document.body.classList.add(`theme-${e.target.value}`);
        }
    });

    const skillsContainer = document.getElementById('skills-container');
    const inventoryContainer = document.getElementById('inventory-container');
    const addItemBtn = document.getElementById('add-item-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const sortAlphabeticalBtn = document.getElementById('sort-alphabetical');
    const sortAttributeBtn = document.getElementById('sort-attribute');
    const addAbilityBtn = document.getElementById('add-ability-btn');
    const addRitualBtn = document.getElementById('add-ritual-btn');
    const addNoteBtn = document.getElementById('add-note-btn');
    const categories = ['I', 'II', 'III', 'IV'];

    // Predefined skills with their attributes
    const predefinedSkills = [
        { name: 'Adestramento', attr: 'PRE' },
        { name: 'Artes', attr: 'INT' },
        { name: 'Atletismo', attr: 'FOR/AGI' },
        { name: 'Atualidades', attr: 'INT' },
        { name: 'Atuar', attr: 'PRE' },
        { name: 'Charme', attr: 'PRE' },
        { name: 'Crime', attr: 'INT/AGI' },
        { name: 'Conhecimentos/Estudos', attr: 'INT' },
        { name: 'Enganação', attr: 'PRE' },
        { name: 'Fortitude', attr: 'VIG' },
        { name: 'Furtividade', attr: 'AGI' },
        { name: 'Iniciativa', attr: 'AGI' },
        { name: 'Intimidação', attr: 'FOR/PRE' },
        { name: 'Intuição', attr: 'PRE' },
        { name: 'Investigação', attr: 'INT' },
        { name: 'Luta', attr: 'FOR' },
        { name: 'Medicina', attr: 'INT' },
        { name: 'Natureza', attr: 'INT' },
        { name: 'Ocultismo', attr: 'INT' },
        { name: 'Ofícios', attr: 'INT' },
        { name: 'Percepção', attr: 'PRE' },
        { name: 'Persuadir', attr: 'PRE' },
        { name: 'Pilotagem', attr: 'AGI' },
        { name: 'Pontaria', attr: 'AGI' },
        { name: 'Reflexos', attr: 'AGI' },
        { name: 'Religião', attr: 'PRE/INT' },
        { name: 'Tática/Planejar', attr: 'INT/AGI' },
        { name: 'Tecnologia', attr: 'INT' },
        { name: 'Vontade', attr: 'PRE' }
    ];

    const skillLevels = ['Plebeu', 'Treinado', 'Veterano', 'Expert'];

    let currentSortMethod = 'alphabetical';

    function getSkillBonus(level) {
        switch (level) {
            case 'Treinado':
                return 3;
            case 'Veterano':
                return 5;
            case 'Expert':
                return 8;
            default:
                return 0;
        }
    }

    function updateThemeColors(characterName) {
        let primary, secondary;
        
        switch (characterName) {
            case 'Nikolai':
                primary = '#374b4c';
                secondary = '#2a3a3b';
                break;
            case 'Math':
                primary = '#ffd700';
                secondary = '#b39700';
                break;
            case 'Gl1tch':
                primary = '#4b0082';
                secondary = '#2d004d';
                break;
            case 'Malta':
                primary = '#ffb843';
                secondary = '#cc9436';
                break;
            case 'Fuzuki':
                primary = '#dc143c';
                secondary = '#a31029';
                break;
            case 'Alfred':
                primary = '#000080';
                secondary = '#000066';
                break;
            case 'Higuruma':
                primary = '#800000';
                secondary = '#660000';
                break;
            default:
                primary = '#4a4a4a';
                secondary = '#2d2d2d';
        }

        document.documentElement.style.setProperty('--theme-primary', primary);
        document.documentElement.style.setProperty('--theme-secondary', secondary);
        document.querySelector('.character-sheet').dataset.character = characterName || '';
    }

    // Initialize character selection and theme
    // Remove the duplicate declaration since we already have it from earlier
    
    // Character theme initialization
    characterSelect.addEventListener('change', (e) => {
        updateThemeColors(e.target.value);
    });

    // Set initial colors if a character is selected
    if (characterSelect.value) {
        updateThemeColors(characterSelect.value);
    }

    function sortSkills() {
        const skills = Array.from(skillsContainer.children);
        
        skills.sort((a, b) => {
            const aName = a.querySelector('div').textContent.split(' (')[0];
            const bName = b.querySelector('div').textContent.split(' (')[0];
            const aAttr = a.querySelector('div').textContent.match(/\((.*?)\)/)[1];
            const bAttr = b.querySelector('div').textContent.match(/\((.*?)\)/)[1];
            
            if (currentSortMethod === 'alphabetical') {
                return aName.localeCompare(bName);
            } else {
                // Sort by attribute first, then by name
                if (aAttr === bAttr) {
                    return aName.localeCompare(bName);
                }
                return aAttr.localeCompare(bAttr);
            }
        });

        // Clear and re-append sorted skills
        skillsContainer.innerHTML = '';
        skills.forEach(skill => skillsContainer.appendChild(skill));
    }

    function createSkillElement(skill) {
        const skillItem = document.createElement('div');
        skillItem.classList.add('skill-item');

        const skillLabel = document.createElement('div');
        skillLabel.textContent = `${skill.name} (${skill.attr})`;
        
        const skillLevelSelect = document.createElement('select');
        skillLevels.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            skillLevelSelect.appendChild(option);
        });

        // Update defense bonuses when skill level changes for Reflexos and Fortitude
        skillLevelSelect.addEventListener('change', (e) => {
            skillItem.dataset.level = e.target.value;
            
            // Update Esquiva bonus if this is the Reflexos skill
            if (skill.name === 'Reflexos') {
                const dodgeBonus = document.getElementById('dodge-bonus');
                let bonus = getSkillBonus(e.target.value);
                dodgeBonus.textContent = bonus > 0 ? `+${bonus}` : '+0';
            }
            
            // Update Bloqueio bonus if this is the Fortitude skill
            if (skill.name === 'Fortitude') {
                const blockBonus = document.getElementById('block-bonus');
                let bonus = getSkillBonus(e.target.value);
                blockBonus.textContent = bonus > 0 ? `+${bonus}` : '+0';
            }
        });

        // Add bonus input field
        const bonusInput = document.createElement('input');
        bonusInput.type = 'number';
        bonusInput.placeholder = 'Bônus';
        bonusInput.value = '0';
        bonusInput.classList.add('skill-bonus');

        // Add roll buttons container
        const rollButtonsContainer = document.createElement('div');
        rollButtonsContainer.classList.add('roll-buttons');

        // Add regular roll button
        const rollButton = document.createElement('button');
        rollButton.textContent = '🎲';
        rollButton.classList.add('roll-button');

        // Add incentive roll button
        const incentiveRollButton = document.createElement('button');
        incentiveRollButton.textContent = 'Incentivo';
        incentiveRollButton.classList.add('incentive-roll-button');

        rollButtonsContainer.appendChild(rollButton);
        rollButtonsContainer.appendChild(incentiveRollButton);

        function addToHistory(diceResults, totalResult, useIncentive) {
            const historyContainer = document.getElementById('dice-history-container');
            const historyEntry = document.createElement('div');
            historyEntry.classList.add('history-entry');
            
            const timestamp = new Date().toLocaleTimeString();
            historyEntry.innerHTML = `
                <div class="history-time">${timestamp}</div>
                <div class="history-skill">${skill.name}</div>
                <div class="history-details">
                    Dados: ${diceResults.join(', ')}
                    ${useIncentive ? '(+1 Incentivo)' : ''}
                </div>
                <div class="history-result">Total: ${totalResult}</div>
            `;
            
            historyContainer.insertBefore(historyEntry, historyContainer.firstChild);
            
            // Limit history to last 10 rolls
            if (historyContainer.children.length > 10) {
                historyContainer.removeChild(historyContainer.lastChild);
            }
        }

        function rollDice(useIncentive = false) {
            const attrs = skill.attr.split('/');
            let selectedAttr;
            
            if (attrs.length > 1) {
                selectedAttr = prompt(`Escolha qual atributo usar para ${skill.name}:\n${attrs.join(' ou ')}`);
                if (!selectedAttr || !attrs.includes(selectedAttr)) {
                    alert('Atributo inválido selecionado.');
                    return;
                }
            } else {
                selectedAttr = attrs[0];
            }

            if (useIncentive) {
                const incentivoInput = document.getElementById('attr-incentivo');
                const incentivoValue = parseInt(incentivoInput.value) || 0;
                
                if (incentivoValue <= 0) {
                    alert('Você não tem pontos de Incentivo suficientes!');
                    return;
                }
                
                incentivoInput.value = incentivoValue - 1;
            }

            const attrValue = parseInt(document.getElementById(`attr-${selectedAttr.toLowerCase()}`).value) || 0;
            const numDice = attrValue + (useIncentive ? 1 : 0);
            const results = [];
            
            // Roll the dice
            for (let i = 0; i < numDice; i++) {
                results.push(Math.floor(Math.random() * 20) + 1);
            }

            // Calculate bonus based on training
            let trainingBonus = getSkillBonus(skillLevelSelect.value);

            // Add additional bonus
            const additionalBonus = parseInt(bonusInput.value) || 0;
            const totalBonus = trainingBonus + additionalBonus;

            // Get the highest roll
            const highestRoll = Math.max(...results);
            const finalResult = highestRoll + totalBonus;

            // Add to history
            addToHistory(results, finalResult, useIncentive);

            // Display results
            let message = `Rolagem de ${skill.name} usando ${selectedAttr}:\n`;
            message += `Dados: ${results.join(', ')}\n`;
            message += `Maior valor: ${highestRoll}\n`;
            message += `Bônus de treino: ${trainingBonus}\n`;
            message += `Bônus adicional: ${additionalBonus}\n`;
            message += `Resultado final: ${finalResult}`;
            
            alert(message);
        }

        rollButton.addEventListener('click', () => rollDice(false));
        incentiveRollButton.addEventListener('click', () => rollDice(true));

        // Add event listener to update the data-level attribute
        skillLevelSelect.addEventListener('change', (e) => {
            skillItem.dataset.level = e.target.value;
        });

        skillItem.appendChild(skillLabel);
        skillItem.appendChild(skillLevelSelect);
        skillItem.appendChild(bonusInput);
        skillItem.appendChild(rollButtonsContainer);
        skillItem.dataset.level = 'Plebeu'; // Set initial level

        return skillItem;
    }

    // Sort button event listeners
    sortAlphabeticalBtn.addEventListener('click', () => {
        currentSortMethod = 'alphabetical';
        sortAlphabeticalBtn.classList.add('active');
        sortAttributeBtn.classList.remove('active');
        sortSkills();
    });

    sortAttributeBtn.addEventListener('click', () => {
        currentSortMethod = 'attribute';
        sortAttributeBtn.classList.add('active');
        sortAlphabeticalBtn.classList.remove('active');
        sortSkills();
    });

    // Initialize skills
    predefinedSkills.forEach(skill => {
        skillsContainer.appendChild(createSkillElement(skill));
    });
    sortSkills(); // Initial sort

    // Initialize progress bars
    function updateProgressBar(currentId, maxId, barClass) {
        const current = parseInt(document.getElementById(currentId).value) || 0;
        const max = parseInt(document.getElementById(maxId).value) || 1;
        const percentage = (current / max) * 100;
        const bar = document.querySelector(`${barClass} .progress-fill`);
        bar.style.width = `${Math.min(100, percentage)}%`;
    }

    // Add event listeners for stat changes
    ['pv', 'pe', 'san'].forEach(stat => {
        document.getElementById(`${stat}-current`).addEventListener('input', () => {
            updateProgressBar(`${stat}-current`, `${stat}-max`, `.${stat}-bar`);
        });
        document.getElementById(`${stat}-max`).addEventListener('input', () => {
            updateProgressBar(`${stat}-current`, `${stat}-max`, `.${stat}-bar`);
        });
    });

    function createInventoryItemElement() {
        const inventoryItem = document.createElement('div');
        inventoryItem.classList.add('inventory-item');
        
        const itemGrid = document.createElement('div');
        itemGrid.classList.add('inventory-item-grid');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Nome do Item';

        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.min = '0';
        weightInput.step = '0.1';
        weightInput.placeholder = 'Peso';

        const categorySelect = document.createElement('select');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        const descriptionInput = document.createElement('textarea');
        descriptionInput.placeholder = 'Descrição do Item';
        descriptionInput.rows = 2;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            inventoryContainer.removeChild(inventoryItem);
        });

        itemGrid.appendChild(nameInput);
        itemGrid.appendChild(weightInput);
        itemGrid.appendChild(categorySelect);
        itemGrid.appendChild(descriptionInput);
        
        inventoryItem.appendChild(itemGrid);
        inventoryItem.appendChild(deleteBtn);

        return inventoryItem;
    }

    addItemBtn.addEventListener('click', () => {
        const currentSlots = inventoryContainer.children.length;
        const maxSlots = parseInt(document.getElementById('inventory-slots').value);

        if (currentSlots < maxSlots) {
            const newItem = createInventoryItemElement();
            inventoryContainer.appendChild(newItem);
        } else {
            alert(`Limite de ${maxSlots} itens no inventário atingido.`);
        }
    });

    function createAbilityElement() {
        const abilityItem = document.createElement('div');
        abilityItem.classList.add('ability-item');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Nome da Habilidade';
        nameInput.classList.add('ability-name');

        const peInput = document.createElement('input');
        peInput.type = 'number';
        peInput.placeholder = 'Custo de PE';
        peInput.min = '0';
        peInput.classList.add('ability-pe');

        const descriptionInput = document.createElement('textarea');
        descriptionInput.placeholder = 'Descrição da Habilidade';
        descriptionInput.classList.add('ability-description');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => abilityItem.remove());

        abilityItem.appendChild(nameInput);
        abilityItem.appendChild(peInput);
        abilityItem.appendChild(descriptionInput);
        abilityItem.appendChild(deleteBtn);

        return abilityItem;
    }

    function createRitualElement() {
        const ritualItem = document.createElement('div');
        ritualItem.classList.add('ritual-item');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Nome do Ritual';
        nameInput.classList.add('ritual-name');

        const peInput = document.createElement('input');
        peInput.type = 'number';
        peInput.placeholder = 'Custo de PE';
        peInput.min = '0';
        peInput.classList.add('ritual-pe');

        const descriptionInput = document.createElement('textarea');
        descriptionInput.placeholder = 'Descrição do Ritual';
        descriptionInput.classList.add('ritual-description');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => ritualItem.remove());

        ritualItem.appendChild(nameInput);
        ritualItem.appendChild(peInput);
        ritualItem.appendChild(descriptionInput);
        ritualItem.appendChild(deleteBtn);

        return ritualItem;
    }

    function createNoteElement() {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');

        const noteInput = document.createElement('textarea');
        noteInput.placeholder = 'Digite sua anotação aqui...';
        noteInput.classList.add('note-content');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => noteItem.remove());

        noteItem.appendChild(noteInput);
        noteItem.appendChild(deleteBtn);

        return noteItem;
    }

    // Add event listeners for the new buttons
    addAbilityBtn.addEventListener('click', () => {
        const abilitiesContainer = document.getElementById('abilities-container');
        abilitiesContainer.appendChild(createAbilityElement());
    });

    addRitualBtn.addEventListener('click', () => {
        const ritualsContainer = document.getElementById('rituals-container');
        ritualsContainer.appendChild(createRitualElement());
    });

    addNoteBtn.addEventListener('click', () => {
        const notesContainer = document.getElementById('notes-container');
        notesContainer.appendChild(createNoteElement());
    });

    // Save and Load functionality
    saveBtn.addEventListener('click', () => {
        const characterData = {
            name: document.getElementById('character-name').value,
            level: document.getElementById('level').value,
            nex: document.getElementById('nex').value,
            origin: document.getElementById('origin').value,
            class: document.getElementById('class').value,
            path: document.getElementById('path').value,
            money: document.getElementById('money').value,
            attributes: {
                for: document.getElementById('attr-for').value,
                agi: document.getElementById('attr-agi').value,
                int: document.getElementById('attr-int').value,
                pre: document.getElementById('attr-pre').value,
                vig: document.getElementById('attr-vig').value,
                incentivo: document.getElementById('attr-incentivo').value
            },
            stats: {
                pv: {
                    current: document.getElementById('pv-current').value,
                    max: document.getElementById('pv-max').value
                },
                pe: {
                    current: document.getElementById('pe-current').value,
                    max: document.getElementById('pe-max').value
                },
                san: {
                    current: document.getElementById('san-current').value,
                    max: document.getElementById('san-max').value
                },
                defense: document.getElementById('defense').value,
                block: document.getElementById('block').value,
                dodge: document.getElementById('dodge').value,
                protection: document.getElementById('protection').value,
                resistance: document.getElementById('resistance').value
            },
            skills: Array.from(document.getElementById('skills-container').children).map(skill => ({
                name: skill.querySelector('div').textContent.split(' (')[0],
                level: skill.querySelector('select').value,
                bonus: skill.querySelector('input.skill-bonus').value
            })),
            inventory: Array.from(document.getElementById('inventory-container').children).map(item => ({
                name: item.querySelector('input[type="text"]').value,
                weight: item.querySelector('input[type="number"]').value,
                category: item.querySelector('select').value,
                description: item.querySelector('textarea').value
            })),
            abilities: Array.from(document.getElementById('abilities-container').children).map(ability => ({
                name: ability.querySelector('input.ability-name').value,
                pe: ability.querySelector('input.ability-pe').value,
                description: ability.querySelector('textarea.ability-description').value
            })),
            rituals: Array.from(document.getElementById('rituals-container').children).map(ritual => ({
                name: ritual.querySelector('input.ritual-name').value,
                pe: ritual.querySelector('input.ritual-pe').value,
                description: ritual.querySelector('textarea.ritual-description').value
            })),
            notes: Array.from(document.getElementById('notes-container').children).map(note => ({
                content: note.querySelector('textarea.note-content').value
            }))
        };

        try {
            localStorage.setItem('characterData', JSON.stringify(characterData));
            alert('Ficha salva com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar a ficha. Por favor, tente novamente.');
        }
    });

    loadBtn.addEventListener('click', () => {
        try {
            const savedData = localStorage.getItem('characterData');
            if (savedData) {
                const characterData = JSON.parse(savedData);
                
                // Load basic info
                document.getElementById('character-name').value = characterData.name || '';
                document.getElementById('level').value = characterData.level || '1';
                document.getElementById('nex').value = characterData.nex || '0';
                document.getElementById('origin').value = characterData.origin || '';
                document.getElementById('class').value = characterData.class || '';
                document.getElementById('path').value = characterData.path || '';
                document.getElementById('money').value = characterData.money || '';

                // Load attributes
                const attributes = characterData.attributes || {};
                document.getElementById('attr-for').value = attributes.for || '0';
                document.getElementById('attr-agi').value = attributes.agi || '0';
                document.getElementById('attr-int').value = attributes.int || '0';
                document.getElementById('attr-pre').value = attributes.pre || '0';
                document.getElementById('attr-vig').value = attributes.vig || '0';
                document.getElementById('attr-incentivo').value = attributes.incentivo || '0';

                // Load stats
                const stats = characterData.stats || {};
                document.getElementById('pv-current').value = stats.pv?.current || '0';
                document.getElementById('pv-max').value = stats.pv?.max || '0';
                document.getElementById('pe-current').value = stats.pe?.current || '0';
                document.getElementById('pe-max').value = stats.pe?.max || '0';
                document.getElementById('san-current').value = stats.san?.current || '0';
                document.getElementById('san-max').value = stats.san?.max || '0';
                document.getElementById('defense').value = stats.defense || '0';
                document.getElementById('block').value = stats.block || '0';
                document.getElementById('dodge').value = stats.dodge || '0';
                document.getElementById('protection').value = stats.protection || '0';
                document.getElementById('resistance').value = stats.resistance || '0';

                // Load skills
                const skillsContainer = document.getElementById('skills-container');
                skillsContainer.innerHTML = '';
                if (characterData.skills) {
                    characterData.skills.forEach(skillData => {
                        const skill = predefinedSkills.find(s => s.name === skillData.name);
                        if (skill) {
                            const skillElement = createSkillElement(skill);
                            skillElement.querySelector('select').value = skillData.level;
                            skillElement.querySelector('input.skill-bonus').value = skillData.bonus;
                            
                            // Restore skill colors based on level
                            const level = skillData.level;
                            const skillDiv = skillElement.querySelector('.skill-item');
                            if (level === 'Treinado') {
                                skillDiv.style.backgroundColor = '#2d4a3e';
                            } else if (level === 'Veterano') {
                                skillDiv.style.backgroundColor = '#4a432d';
                            } else if (level === 'Expert') {
                                skillDiv.style.backgroundColor = '#4a2d2d';
                            } else {
                                skillDiv.style.backgroundColor = '';
                            }
                            
                            skillsContainer.appendChild(skillElement);
                        }
                    });
                }

                // Load inventory
                const inventoryContainer = document.getElementById('inventory-container');
                inventoryContainer.innerHTML = '';
                if (characterData.inventory) {
                    characterData.inventory.forEach(itemData => {
                        const itemElement = createInventoryItemElement();
                        itemElement.querySelector('input[type="text"]').value = itemData.name;
                        itemElement.querySelector('input[type="number"]').value = itemData.weight;
                        itemElement.querySelector('select').value = itemData.category;
                        itemElement.querySelector('textarea').value = itemData.description;
                        inventoryContainer.appendChild(itemElement);
                    });
                }

                // Load abilities
                const abilitiesContainer = document.getElementById('abilities-container');
                abilitiesContainer.innerHTML = '';
                if (characterData.abilities) {
                    characterData.abilities.forEach(abilityData => {
                        const abilityElement = createAbilityElement();
                        abilityElement.querySelector('input.ability-name').value = abilityData.name;
                        abilityElement.querySelector('input.ability-pe').value = abilityData.pe;
                        abilityElement.querySelector('textarea.ability-description').value = abilityData.description;
                        abilitiesContainer.appendChild(abilityElement);
                    });
                }

                // Load rituals
                const ritualsContainer = document.getElementById('rituals-container');
                ritualsContainer.innerHTML = '';
                if (characterData.rituals) {
                    characterData.rituals.forEach(ritualData => {
                        const ritualElement = createRitualElement();
                        ritualElement.querySelector('input.ritual-name').value = ritualData.name;
                        ritualElement.querySelector('input.ritual-pe').value = ritualData.pe;
                        ritualElement.querySelector('textarea.ritual-description').value = ritualData.description;
                        ritualsContainer.appendChild(ritualElement);
                    });
                }

                // Load notes
                const notesContainer = document.getElementById('notes-container');
                notesContainer.innerHTML = '';
                if (characterData.notes) {
                    characterData.notes.forEach(noteData => {
                        const noteElement = createNoteElement();
                        noteElement.querySelector('textarea.note-content').value = noteData.content;
                        notesContainer.appendChild(noteElement);
                    });
                }

                // Restore theme colors for character name
                const characterName = document.getElementById('character-name');
                if (characterName.value) {
                    updateThemeColors(characterName.value);
                }

                alert('Ficha carregada com sucesso!');
            } else {
                alert('Nenhuma ficha salva encontrada!');
            }
        } catch (error) {
            console.error('Erro ao carregar:', error);
            alert('Erro ao carregar a ficha. Por favor, tente novamente.');
        }
    });
});
