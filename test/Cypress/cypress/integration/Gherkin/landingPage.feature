Feature: Landing Page Feature

As an Admin
In order to let users get information about markets and customize the landing page
I want to check elements existence and sequencing of the landing page

Scenario: Successfull Landing Page Arrangements

    Given I am on the Hollaex landing page
    And I record all elements locations
    Then I should be able to click on the live market
    And I login and check quick trade
    Then I visit the landing page in edit mode
    And I check the sequence of elements Title, Market list, and Quick trade calculator
    When I change the sequence
    Then Elements should be arranged
    

