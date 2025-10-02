import pytest
import numpy as np
from helpers import compute_product_of_world


def test_compute_product_of_world_basic():
    """Test basic multiplication of three positive integers."""
    result = compute_product_of_world(100, 10, 50)
    expected = 100 * 10 * 50
    assert result == expected


def test_compute_product_of_world_with_zeros():
    """Test that product is zero when any parameter is zero."""
    assert compute_product_of_world(0, 10, 50) == 0
    assert compute_product_of_world(100, 0, 50) == 0
    assert compute_product_of_world(100, 10, 0) == 0


def test_compute_product_of_world_with_ones():
    """Test multiplication with ones."""
    assert compute_product_of_world(1, 1, 1) == 1
    assert compute_product_of_world(100, 1, 1) == 100


def test_compute_product_of_world_large_numbers():
    """Test with large numbers similar to actual game values."""
    result = compute_product_of_world(2000, 10, 100)
    expected = 2000 * 10 * 100
    assert result == expected
