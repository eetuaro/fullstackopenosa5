describe('Blog app', function () {
  // TESTI KÄYTTÄJÄ
  const user = {
    name: 'Test User',
    username: 'testuser',
    password: 'password123',
  };

  beforeEach(function () {
    // RESET
    cy.request('POST', 'http://localhost:3003/api/testing/reset');

    // KÄYTTÄJÄ LUODAAN
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:5173');

    // SISÄÄN KIRJAUTUMINEN
    cy.get('input[name="Username"]').type(user.username);
    cy.get('input[name="Password"]').type(user.password);
    cy.get('button[type="submit"]').click();
  });

  describe('When logged in', function () {
    it('Blogs are sorted by likes count', function () {
      // luodaan useita blogeja
      cy.contains('create new blog').click();
      cy.get('input[name="Title"]').type('Blog1');
      cy.get('input[name="Author"]').type('TestAuthor');
      cy.get('input[name="Url"]').type('http://testblog.com');
      cy.get('button[type="submit"]').click();

      cy.get('input[name="Title"]').type('Blog2');
      cy.get('input[name="Author"]').type('TestAuthor1');
      cy.get('input[name="Url"]').type('http://testblog1.com');
      cy.get('button[type="submit"]').click();

      cy.get('input[name="Title"]').type('Blog3');
      cy.get('input[name="Author"]').type('TestAuthor2');
      cy.get('input[name="Url"]').type('http://testblog2.com');
      cy.get('button[type="submit"]').click();

      // Tarkista, että blogit on luotu
      cy.contains('Blog1');
      cy.contains('Blog2');
      cy.contains('Blog3');

      // Tykkäykset blogeihin
      cy.get('.blog').eq(0).contains('view').click();
      cy.get('.blog').eq(0).contains('like').click();
      cy.wait(500);

      cy.get('.blog').eq(1).contains('view').click();
      cy.get('.blog').eq(1).contains('like').click();
      cy.wait(500);

      cy.get('.blog').eq(2).contains('view').click();
      cy.get('.blog').eq(2).contains('like').click();
      cy.wait(500);

      cy.get('.blog').eq(0).contains('like').click(); // Lisää tykkäys
      cy.get('.blog').eq(1).contains('like').click(); // Lisää tykkäys
      cy.wait(500);

      cy.get('.blog').eq(1).contains('like').click();
      cy.wait(500);
    });
  });
});
