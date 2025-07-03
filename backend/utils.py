import numpy as np
import time
from functools import wraps
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def timing_decorator(func):
    """Decorator to measure function execution time"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        logger.info(f"{func.__name__} executed in {end_time - start_time:.4f}s")
        return result
    return wrapper

def validate_params(params, required_keys, limits=None):
    """Validate API parameters"""
    for key in required_keys:
        if key not in params:
            raise ValueError(f"Missing required parameter: {key}")
    
    if limits:
        for key, (min_val, max_val) in limits.items():
            if key in params:
                if not min_val <= params[key] <= max_val:
                    raise ValueError(f"Parameter {key} must be between {min_val} and {max_val}")
    
    return True