import pytest
import numpy as np
from helpers import compute_product_of_world


class TestComputeProductOfWorld:
    """Test suite for compute_product_of_world function."""

    def test_compute_product_basic(self):
        """Test basic product computation with positive integers."""
        result = compute_product_of_world(10, 5, 2)
        assert result == 100
        assert isinstance(result, (int, np.integer))

    def test_compute_product_with_zeros(self):
        """Test product computation when one parameter is zero."""
        result = compute_product_of_world(0, 5, 2)
        assert result == 0

    def test_compute_product_all_zeros(self):
        """Test product computation when all parameters are zero."""
        result = compute_product_of_world(0, 0, 0)
        assert result == 0

    def test_compute_product_with_ones(self):
        """Test product computation with ones."""
        result = compute_product_of_world(1, 1, 1)
        assert result == 1

    def test_compute_product_large_numbers(self):
        """Test product computation with large numbers."""
        result = compute_product_of_world(2000, 10, 100)
        assert result == 2000000
        assert isinstance(result, (int, np.integer))

    def test_compute_product_actual_game_values(self):
        """Test with actual game configuration values."""
        WORLD_SIZE = 2000
        NUM_AI_PLAYERS = 10
        NUM_FOOD = 100
        result = compute_product_of_world(WORLD_SIZE, NUM_AI_PLAYERS, NUM_FOOD)
        assert result == 2000000

    def test_compute_product_order_independence(self):
        """Test that the order of parameters doesn't affect the result."""
        result1 = compute_product_of_world(10, 5, 2)
        result2 = compute_product_of_world(2, 10, 5)
        result3 = compute_product_of_world(5, 2, 10)
        assert result1 == result2 == result3 == 100

    def test_compute_product_single_large_value(self):
        """Test product with one large value and small values."""
        result = compute_product_of_world(10000, 1, 1)
        assert result == 10000

    def test_compute_product_return_type(self):
        """Test that the function returns a numpy integer type."""
        result = compute_product_of_world(10, 5, 2)
        assert isinstance(result, (int, np.integer))

    def test_compute_product_negative_numbers(self):
        """Test product computation with negative numbers."""
        result = compute_product_of_world(-10, 5, 2)
        assert result == -100

    def test_compute_product_mixed_signs(self):
        """Test product computation with mixed positive and negative numbers."""
        result = compute_product_of_world(-10, -5, 2)
        assert result == 100

    def test_compute_product_all_negative(self):
        """Test product computation with all negative numbers."""
        result = compute_product_of_world(-10, -5, -2)
        assert result == -100

    def test_compute_product_float_inputs(self):
        """Test product computation with float inputs."""
        result = compute_product_of_world(10.5, 5.0, 2.0)
        assert result == pytest.approx(105.0)

    def test_compute_product_very_large_numbers(self):
        """Test product computation with very large numbers."""
        result = compute_product_of_world(100000, 100, 100)
        assert result == 1000000000

    def test_compute_product_decimal_values(self):
        """Test product computation with decimal values."""
        result = compute_product_of_world(2.5, 4.0, 10.0)
        assert result == pytest.approx(100.0)

    def test_compute_product_consistency(self):
        """Test that multiple calls with same parameters return same result."""
        result1 = compute_product_of_world(100, 50, 25)
        result2 = compute_product_of_world(100, 50, 25)
        assert result1 == result2

    def test_compute_product_uses_numpy(self):
        """Test that the function uses numpy.prod."""
        result = compute_product_of_world(10, 5, 2)
        expected = np.prod([10, 5, 2])
        assert result == expected

    def test_compute_product_small_decimals(self):
        """Test product computation with small decimal values."""
        result = compute_product_of_world(0.1, 0.2, 0.3)
        assert result == pytest.approx(0.006)

    def test_compute_product_boundary_values(self):
        """Test product computation with boundary values."""
        result = compute_product_of_world(1, 1, 1)
        assert result == 1
        
        result = compute_product_of_world(5000, 20, 200)
        assert result == 20000000
