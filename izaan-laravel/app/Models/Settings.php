<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    protected $table = 'Settings';

    const CREATED_AT = null;
    const UPDATED_AT = 'updatedAt';

    protected $fillable = ['key', 'value'];
}
