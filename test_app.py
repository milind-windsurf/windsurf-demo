import pytest
import json
from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


class TestIndexRoute:
    """Test suite for the index route."""

    def test_index_returns_200(self, client):
        """Test that index route returns 200 status code."""
        response = client.get('/')
        assert response.status_code == 200

    def test_index_returns_html(self, client):
        """Test that index route returns HTML content."""
        response = client.get('/')
        assert response.content_type == 'text/html; charset=utf-8'

    def test_index_renders_template(self, client):
        """Test that index route renders the game.html template."""
        response = client.get('/')
        assert b'<!DOCTYPE html>' in response.data or b'<html' in response.data

    def test_index_contains_game_elements(self, client):
        """Test that index route contains expected game elements."""
        response = client.get('/')
        assert b'gameCanvas' in response.data or b'canvas' in response.data


class TestGameStateRoute:
    """Test suite for the game_state route."""

    def test_game_state_returns_200(self, client):
        """Test that game_state route returns 200 status code."""
        response = client.get('/game_state')
        assert response.status_code == 200

    def test_game_state_returns_json(self, client):
        """Test that game_state route returns JSON content."""
        response = client.get('/game_state')
        assert response.content_type == 'application/json'

    def test_game_state_returns_valid_json(self, client):
        """Test that game_state route returns valid JSON."""
        response = client.get('/game_state')
        data = json.loads(response.data)
        assert isinstance(data, dict)

    def test_game_state_contains_status(self, client):
        """Test that game_state response contains status field."""
        response = client.get('/game_state')
        data = json.loads(response.data)
        assert 'status' in data

    def test_game_state_status_is_ok(self, client):
        """Test that game_state returns status 'ok'."""
        response = client.get('/game_state')
        data = json.loads(response.data)
        assert data['status'] == 'ok'

    def test_game_state_get_method_only(self, client):
        """Test that game_state only accepts GET requests."""
        response = client.post('/game_state')
        assert response.status_code == 405  # Method Not Allowed

    def test_game_state_multiple_requests(self, client):
        """Test that multiple game_state requests work correctly."""
        response1 = client.get('/game_state')
        response2 = client.get('/game_state')
        assert response1.status_code == 200
        assert response2.status_code == 200
        data1 = json.loads(response1.data)
        data2 = json.loads(response2.data)
        assert data1['status'] == 'ok'
        assert data2['status'] == 'ok'


class TestUpdatePlayerRoute:
    """Test suite for the update_player route."""

    def test_update_player_returns_200(self, client):
        """Test that update_player route returns 200 status code."""
        response = client.post('/update_player', 
                              json={'x': 100, 'y': 200},
                              content_type='application/json')
        assert response.status_code == 200

    def test_update_player_returns_json(self, client):
        """Test that update_player route returns JSON content."""
        response = client.post('/update_player',
                              json={'x': 100, 'y': 200},
                              content_type='application/json')
        assert response.content_type == 'application/json'

    def test_update_player_returns_valid_json(self, client):
        """Test that update_player route returns valid JSON."""
        response = client.post('/update_player',
                              json={'x': 100, 'y': 200},
                              content_type='application/json')
        data = json.loads(response.data)
        assert isinstance(data, dict)

    def test_update_player_contains_status(self, client):
        """Test that update_player response contains status field."""
        response = client.post('/update_player',
                              json={'x': 100, 'y': 200},
                              content_type='application/json')
        data = json.loads(response.data)
        assert 'status' in data

    def test_update_player_status_is_ok(self, client):
        """Test that update_player returns status 'ok'."""
        response = client.post('/update_player',
                              json={'x': 100, 'y': 200},
                              content_type='application/json')
        data = json.loads(response.data)
        assert data['status'] == 'ok'

    def test_update_player_post_method_only(self, client):
        """Test that update_player only accepts POST requests."""
        response = client.get('/update_player')
        assert response.status_code == 405  # Method Not Allowed

    def test_update_player_with_empty_json(self, client):
        """Test that update_player handles empty JSON."""
        response = client.post('/update_player',
                              json={},
                              content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'ok'

    def test_update_player_with_player_data(self, client):
        """Test that update_player handles player position data."""
        player_data = {
            'x': 500,
            'y': 300,
            'score': 150
        }
        response = client.post('/update_player',
                              json=player_data,
                              content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'ok'

    def test_update_player_with_multiple_cells(self, client):
        """Test that update_player handles multiple cell data."""
        player_data = {
            'cells': [
                {'x': 100, 'y': 200, 'score': 50},
                {'x': 300, 'y': 400, 'score': 75}
            ]
        }
        response = client.post('/update_player',
                              json=player_data,
                              content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'ok'

    def test_update_player_multiple_requests(self, client):
        """Test that multiple update_player requests work correctly."""
        response1 = client.post('/update_player',
                               json={'x': 100, 'y': 200},
                               content_type='application/json')
        response2 = client.post('/update_player',
                               json={'x': 300, 'y': 400},
                               content_type='application/json')
        assert response1.status_code == 200
        assert response2.status_code == 200
        data1 = json.loads(response1.data)
        data2 = json.loads(response2.data)
        assert data1['status'] == 'ok'
        assert data2['status'] == 'ok'

    def test_update_player_without_content_type(self, client):
        """Test that update_player handles requests without content type."""
        response = client.post('/update_player',
                              data=json.dumps({'x': 100, 'y': 200}))
        assert response.status_code in [200, 400, 415]


class TestAppConfiguration:
    """Test suite for Flask app configuration."""

    def test_app_exists(self):
        """Test that Flask app instance exists."""
        assert app is not None

    def test_app_is_flask_instance(self):
        """Test that app is a Flask instance."""
        from flask import Flask
        assert isinstance(app, Flask)

    def test_app_has_routes(self):
        """Test that app has registered routes."""
        routes = [rule.rule for rule in app.url_map.iter_rules()]
        assert '/' in routes
        assert '/game_state' in routes
        assert '/update_player' in routes

    def test_app_testing_mode(self, client):
        """Test that app can be set to testing mode."""
        assert app.config['TESTING'] == True


class TestErrorHandling:
    """Test suite for error handling."""

    def test_404_for_nonexistent_route(self, client):
        """Test that nonexistent routes return 404."""
        response = client.get('/nonexistent')
        assert response.status_code == 404

    def test_405_for_wrong_method_game_state(self, client):
        """Test that wrong HTTP method returns 405 for game_state."""
        response = client.post('/game_state')
        assert response.status_code == 405

    def test_405_for_wrong_method_update_player(self, client):
        """Test that wrong HTTP method returns 405 for update_player."""
        response = client.get('/update_player')
        assert response.status_code == 405


class TestConstants:
    """Test suite for app constants."""

    def test_world_size_constant(self):
        """Test that WORLD_SIZE constant is defined."""
        from app import WORLD_SIZE
        assert WORLD_SIZE is not None
        assert isinstance(WORLD_SIZE, int)
        assert WORLD_SIZE > 0

    def test_num_ai_players_constant(self):
        """Test that NUM_AI_PLAYERS constant is defined."""
        from app import NUM_AI_PLAYERS
        assert NUM_AI_PLAYERS is not None
        assert isinstance(NUM_AI_PLAYERS, int)
        assert NUM_AI_PLAYERS > 0

    def test_num_food_constant(self):
        """Test that NUM_FOOD constant is defined."""
        from app import NUM_FOOD
        assert NUM_FOOD is not None
        assert isinstance(NUM_FOOD, int)
        assert NUM_FOOD > 0

    def test_constants_have_expected_values(self):
        """Test that constants have expected values."""
        from app import WORLD_SIZE, NUM_AI_PLAYERS, NUM_FOOD
        assert WORLD_SIZE == 2000
        assert NUM_AI_PLAYERS == 10
        assert NUM_FOOD == 100
