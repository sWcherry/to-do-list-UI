// cypress/e2e/full_flow.cy.ts

describe('To-Do List Comprehensive E2E Tests', () => {
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    username: 'tester',
    password: 'Password123'
  };

  const profileData = {
    id: 1,
    username: testUser.username,
    full_name: 'Tester User',
    email: testUser.email,
    first_name: 'Tester',
    last_name: 'User',
    gender: 'M',
    birth_date: '1990-01-01',
    avatar: 'T'
  };

  let tasks: any[] = [];

  const resetApiMocks = () => {
    tasks = [];
  };

  beforeEach(() => {
    resetApiMocks();

    cy.intercept('POST', '**/auth/login/', { body: { token: 'fake_token' } }).as('loginSuccess');
    cy.intercept('GET', '**/auth/profile/', { body: profileData }).as('getProfile');
    cy.intercept('PATCH', '**/auth/profile/', { 
      statusCode: 200, 
      body: { ...profileData, first_name: 'NewName' } 
    }).as('updateProfile');
    cy.intercept('GET', '**/tasks/', (req) => {
      req.reply({ body: { results: tasks } });
    }).as('getTasks');
    cy.intercept('POST', '**/tasks/create/', (req) => {
      const body = req.body as any;
      const newTask = {
        id: tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
        title: body.title,
        description: body.description,
        status: body.status || 'Assigned',
        deadline: body.deadline || null,
        owner: {
          id: profileData.id,
          full_name: profileData.full_name
        },
        assigned_to: body.assigned_to ? { id: body.assigned_to, full_name: profileData.full_name } : null
      };
      tasks.push(newTask);
      req.reply({ body: newTask });
    }).as('createTask');
    cy.intercept('PATCH', '**/tasks/*/', (req) => {
      const id = Number(req.url.split('/').filter(Boolean).pop());
      const index = tasks.findIndex((task) => task.id === id);
      if (index >= 0) {
        tasks[index] = { ...tasks[index], ...req.body };
        req.reply({ body: tasks[index] });
      } else {
        req.reply({ statusCode: 404 });
      }
    }).as('updateTask');
    cy.intercept('DELETE', '**/tasks/*/', (req) => {
      const id = Number(req.url.split('/').filter(Boolean).pop());
      tasks = tasks.filter((task) => task.id !== id);
      req.reply({ body: {} });
    }).as('deleteTask');

    cy.visit('/');
  });

  it('should cover AboutPage', () => {
    cy.contains('About').click();
    cy.url().should('include', '/about');
    cy.contains('Version 1.0.0').should('be.visible'); 
  });

  it('should handle Registration and validation errors', () => {
    cy.visit('/register');
    
    // Перевірка обробки помилки реєстрації 
    cy.intercept('POST', '**/auth/register/', { statusCode: 400 }).as('registerFail');
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (str) => expect(str).to.equal('Registration failed'));
    cy.wait('@registerFail');

    // Успішна реєстрація 
    cy.intercept('POST', '**/auth/register/', { token: 'fake_token' }).as('registerSuccess');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="username"]').type(testUser.username);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('input[name="password_confirm"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/tasks');
  });

  it('should cover detailed Task interactions', () => {
    // Авторизація для доступу до Tasks
    cy.visit('/login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button').contains('Log in').click();
    cy.url().should('include', '/tasks');
    cy.wait('@getTasks');

    // Створення завдання 
    cy.contains('Create Task').click();
    cy.get('input[name="title"]').type('Complex Task');
    cy.get('input[name="description"]').type('Detailed description for coverage');
    cy.get('button').contains(/^Create$/).click();
    cy.contains('Action successful').should('be.visible');

    // Розгортання деталей та редагування
    cy.contains('Complex Task')
      .parents('.MuiAccordion-root')
      .as('taskAccordion');

    cy.get('@taskAccordion')
      .find('.MuiAccordionSummary-root')
      .click();

    cy.get('@taskAccordion')
      .find('button')
      .contains('Edit')
      .should('be.visible')
      .click();

    cy.get('@taskAccordion')
      .find('textarea:visible')
      .clear()
      .type('Updated description');

    cy.get('@taskAccordion')
      .contains('button', 'Save')
      .click();

    cy.contains('Complex Task')
      .parents('.MuiAccordion-root')
      .as('taskAccordion');

    cy.get('@taskAccordion')
      .find('.MuiAccordionSummary-root')
      .click();
    cy.contains('Updated description').should('be.visible');

    // Видалення з відміною (ConfirmDialog)
    cy.get('button').contains('Delete').first().click();
    cy.get('button').contains('Cancel').click();
    cy.contains('Complex Task').should('exist');

    // Повне видалення
    cy.get('button').contains('Delete').first().click();
    cy.get('.MuiDialog-container').should('be.visible').within(() => {
      cy.get('button').contains('Delete').click({ force: true }); 
    });

    cy.wait('@deleteTask');
    cy.contains('Complex Task').should('not.exist');
  });

  it('should cover ProfilePage editing and Logout', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button').contains('Log in').click();

    cy.get('a').contains('Profile').click();
    cy.url().should('include', '/profile');

    // Перевірка відображення даних профілю
    cy.contains(testUser.email).should('be.visible');

    // Редагування профілю 
    cy.contains('Edit Profile').click();
    cy.get('input[name="first_name"]').clear().type('NewName');
    cy.get('button').contains('Save').click();

    // Логаут
    cy.get('button').contains('Log out').click();
    cy.url().should('include', '/login');
  });
});