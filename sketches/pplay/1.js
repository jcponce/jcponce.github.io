webpackJsonp([1],{

/***/ "./node_modules/glsl-parser/parser.js":
/***/ (function(module, exports, __webpack_require__) {

(function() {
  function __extends(derived, base) {
    derived.prototype = Object.create(base.prototype);
    derived.prototype.constructor = derived;
  }

  var __imul = Math.imul ? Math.imul : function(a, b) {
    return (a * (b >>> 16) << 16) + a * (b & 65535) | 0;
  };

  function __isString(value) {
    return typeof value === 'string';
  }

  function assert(truth) {
    if (!truth) {
      throw Error('Assertion failed');
    }
  }

  var GLSLX = {};

  GLSLX.RenameSymbols = {
    ALL: 0
  };

  GLSLX.CompilerOptions = function() {
    this.compactSyntaxTree = true;
    this.removeWhitespace = true;
    this.renameSymbols = GLSLX.RenameSymbols.ALL;
    this.trimSymbols = true;
    this.fileAccess = null;
    this.globals = null;
  };

  GLSLX.ExtensionBehavior = {
    DEFAULT: 0,
    DISABLE: 1,
    ENABLE: 2,
    REQUIRE: 3,
    WARN: 4
  };

  GLSLX.CompilerData = function(fileAccess) {
    this.currentExtensions = Object.create(null);
    this.fileAccess = fileAccess;
    this._nextSymbolID = 0;
  };

  GLSLX.CompilerData.prototype.nextSymbolID = function() {
    this._nextSymbolID = this._nextSymbolID + 1 | 0;
    return this._nextSymbolID;
  };

  GLSLX.CompilerData.prototype.extensionBehavior = function(name) {
    return in_StringMap.get(this.currentExtensions, name, GLSLX.ExtensionBehavior.DEFAULT);
  };

  GLSLX.Compiler = {};

  GLSLX.Compiler.typeCheck = function(log, sources, options) {
    if (log.hasErrors()) {
      return null;
    }

    // Generate tokens once
    sources.unshift(new GLSLX.Source('<api>', GLSLX.API));

    if (options.globals != null) {
      sources.unshift(new GLSLX.Source('<externs_globals>', options.globals));
    }

    for (var i = 0, list = sources, count = list.length; i < count; i = i + 1 | 0) {
      var source = in_List.get(list, i);
      source.tokens = GLSLX.Tokenizer.tokenize(log, source);
    }

    var global = new GLSLX.Node(GLSLX.NodeKind.GLOBAL);
    var scope = new GLSLX.Scope(GLSLX.ScopeKind.GLOBAL, null);
    var data = new GLSLX.CompilerData(options.fileAccess);
    var resolver = new GLSLX.Resolver(log, data);

    // Parse everything next
    for (var i1 = 0, list1 = sources, count1 = list1.length; i1 < count1; i1 = i1 + 1 | 0) {
      var source1 = in_List.get(list1, i1);
      GLSLX.Parser.parse(log, source1.tokens, global, data, scope, resolver);
    }

    // Then run type checking
    resolver.resolveGlobal(global);

    // Always return even when there were errors since the partial result is still useful
    return global;
  };

  GLSLX.ControlFlowAnalyzer = function() {
    this._isLoopBreakTarget = [];
    this._isControlFlowLive = [];
  };

  GLSLX.ControlFlowAnalyzer.prototype.pushBlock = function(node) {
    var parent = node.parent();

    // Push control flow
    this._isControlFlowLive.push(this._isControlFlowLive.length == 0 || in_List.last(this._isControlFlowLive));

    // Push loop info
    if (parent != null && GLSLX.in_NodeKind.isLoop(parent.kind)) {
      this._isLoopBreakTarget.push(false);
    }
  };

  GLSLX.ControlFlowAnalyzer.prototype.popBlock = function(node) {
    var parent = node.parent();

    // Pop control flow
    var isLive = in_List.takeLast(this._isControlFlowLive);

    if (isLive) {
      node.hasControlFlowAtEnd = true;
    }

    // Pop loop info
    if (parent != null && GLSLX.in_NodeKind.isLoop(parent.kind) && !in_List.takeLast(this._isLoopBreakTarget) && (parent.kind == GLSLX.NodeKind.WHILE && parent.whileTest().isTrue() || parent.kind == GLSLX.NodeKind.DO_WHILE && parent.doWhileTest().isTrue() || parent.kind == GLSLX.NodeKind.FOR && (parent.forTest() == null || parent.forTest().isTrue()))) {
      in_List.setLast(this._isControlFlowLive, false);
    }
  };

  GLSLX.ControlFlowAnalyzer.prototype.visitStatement = function(node) {
    if (!in_List.last(this._isControlFlowLive)) {
      return;
    }

    switch (node.kind) {
      case GLSLX.NodeKind.BREAK: {
        if (!(this._isLoopBreakTarget.length == 0)) {
          in_List.setLast(this._isLoopBreakTarget, true);
        }

        in_List.setLast(this._isControlFlowLive, false);
        break;
      }

      case GLSLX.NodeKind.RETURN:
      case GLSLX.NodeKind.DISCARD:
      case GLSLX.NodeKind.CONTINUE: {
        in_List.setLast(this._isControlFlowLive, false);
        break;
      }

      case GLSLX.NodeKind.IF: {
        var test = node.ifTest();
        var trueValue = node.ifTrue();
        var falseValue = node.ifFalse();

        if (test.isTrue()) {
          if (!trueValue.hasControlFlowAtEnd) {
            in_List.setLast(this._isControlFlowLive, false);
          }
        }

        else if (test.isFalse() && falseValue != null) {
          if (!falseValue.hasControlFlowAtEnd) {
            in_List.setLast(this._isControlFlowLive, false);
          }
        }

        else if (trueValue != null && falseValue != null) {
          if (!trueValue.hasControlFlowAtEnd && !falseValue.hasControlFlowAtEnd) {
            in_List.setLast(this._isControlFlowLive, false);
          }
        }
        break;
      }
    }
  };

  GLSLX.Folder = {};

  GLSLX.Folder.fold = function(node) {
    if (RELEASE) {
      return GLSLX.Folder._fold(node);
    }

    // Run sanity checks in debug mode
    else {
      var folded = GLSLX.Folder._fold(node);

      if (folded != null) {
        assert(folded.parent() == null);

        if (folded.kind != GLSLX.NodeKind.UNKNOWN_CONSTANT) {
          GLSLX.Folder._check(folded);
        }
      }

      return folded;
    }
  };

  GLSLX.Folder._check = function(node) {
    switch (node.kind) {
      case GLSLX.NodeKind.INT: {
        assert(node.resolvedType == GLSLX.Type.INT && !node.hasChildren());
        break;
      }

      case GLSLX.NodeKind.BOOL: {
        assert(node.resolvedType == GLSLX.Type.BOOL && !node.hasChildren());
        break;
      }

      case GLSLX.NodeKind.FLOAT: {
        assert(node.resolvedType == GLSLX.Type.FLOAT && !node.hasChildren());
        break;
      }

      case GLSLX.NodeKind.CALL: {
        var target = node.callTarget();
        assert(target.kind == GLSLX.NodeKind.TYPE);
        assert(target.resolvedType == node.resolvedType);
        var componentType = target.resolvedType.componentType();
        var componentCount = target.resolvedType.componentCount();

        // Native component types
        if (componentType != null) {
          assert(node.childCount() == (1 + componentCount | 0));
          assert(target.resolvedType != GLSLX.Type.INT && target.resolvedType != GLSLX.Type.BOOL && target.resolvedType != GLSLX.Type.FLOAT);

          for (var child = target.nextSibling(); child != null; child = child.nextSibling()) {
            assert(child.resolvedType == componentType);
            assert(child.kind != GLSLX.NodeKind.CALL);
            GLSLX.Folder._check(child);
          }
        }

        // User-defined structs
        else {
          var struct = target.resolvedType.symbol.asStruct();
          var i = 0;
          assert(node.childCount() == (1 + struct.variables.length | 0));

          for (var child1 = target.nextSibling(); child1 != null; child1 = child1.nextSibling()) {
            assert(child1.resolvedType == in_List.get(struct.variables, i).type.resolvedType);
            GLSLX.Folder._check(child1);
            i = i + 1 | 0;
          }
        }
        break;
      }

      default: {
        assert(false);
        break;
      }
    }
  };

  GLSLX.Folder._fold = function(node) {
    assert(node.resolvedType != null);

    if (node.resolvedType == GLSLX.Type.ERROR) {
      return null;
    }

    switch (node.kind) {
      case GLSLX.NodeKind.INT:
      case GLSLX.NodeKind.FLOAT:
      case GLSLX.NodeKind.BOOL: {
        return node.clone();
      }

      case GLSLX.NodeKind.NAME: {
        return GLSLX.Folder._foldName(node);
      }

      case GLSLX.NodeKind.SEQUENCE: {
        return GLSLX.Folder._foldSequence(node);
      }

      case GLSLX.NodeKind.HOOK: {
        return GLSLX.Folder._foldHook(node);
      }

      case GLSLX.NodeKind.DOT: {
        return GLSLX.Folder._foldDot(node);
      }

      case GLSLX.NodeKind.INDEX: {
        return GLSLX.Folder._foldIndex(node);
      }

      case GLSLX.NodeKind.CALL: {
        return GLSLX.Folder._foldCall(node);
      }

      case GLSLX.NodeKind.NEGATIVE: {
        return GLSLX.Folder._foldUnaryFloatOrInt(node, function(x) {
          return -x;
        }, function(x) {
          return -x | 0;
        });
      }

      case GLSLX.NodeKind.NOT: {
        return GLSLX.Folder._foldUnaryBool(node, function(x) {
          return !x;
        });
      }

      case GLSLX.NodeKind.POSITIVE: {
        return GLSLX.Folder._foldUnaryFloatOrInt(node, function(x) {
          return +x;
        }, function(x) {
          return +x;
        });
      }

      case GLSLX.NodeKind.ADD: {
        return GLSLX.Folder._foldBinaryFloatOrInt(node, function(a, b) {
          return a + b;
        }, function(a, b) {
          return a + b | 0;
        });
      }

      case GLSLX.NodeKind.SUBTRACT: {
        return GLSLX.Folder._foldBinaryFloatOrInt(node, function(a, b) {
          return a - b;
        }, function(a, b) {
          return a - b | 0;
        });
      }

      case GLSLX.NodeKind.MULTIPLY: {
        return GLSLX.Folder._foldMultiply(node);
      }

      case GLSLX.NodeKind.DIVIDE: {
        return GLSLX.Folder._foldBinaryFloatOrInt(node, function(a, b) {
          return b != 0 ? a / b : 0;
        }, function(a, b) {
          return b != 0 ? a / b | 0 : 0;
        });
      }

      case GLSLX.NodeKind.EQUAL:
      case GLSLX.NodeKind.NOT_EQUAL: {
        return GLSLX.Folder._foldBinaryEquality(node);
      }

      case GLSLX.NodeKind.LOGICAL_AND: {
        return GLSLX.Folder._foldBinaryBool(node, function(a, b) {
          return a && b;
        });
      }

      case GLSLX.NodeKind.LOGICAL_OR: {
        return GLSLX.Folder._foldBinaryBool(node, function(a, b) {
          return a || b;
        });
      }

      case GLSLX.NodeKind.LOGICAL_XOR: {
        return GLSLX.Folder._foldBinaryBool(node, function(a, b) {
          return a != b;
        });
      }

      case GLSLX.NodeKind.GREATER_THAN: {
        return GLSLX.Folder._foldBinaryFloatOrIntToBool(node, function(a, b) {
          return a > b;
        });
      }

      case GLSLX.NodeKind.GREATER_THAN_OR_EQUAL: {
        return GLSLX.Folder._foldBinaryFloatOrIntToBool(node, function(a, b) {
          return a >= b;
        });
      }

      case GLSLX.NodeKind.LESS_THAN: {
        return GLSLX.Folder._foldBinaryFloatOrIntToBool(node, function(a, b) {
          return a < b;
        });
      }

      case GLSLX.NodeKind.LESS_THAN_OR_EQUAL: {
        return GLSLX.Folder._foldBinaryFloatOrIntToBool(node, function(a, b) {
          return a <= b;
        });
      }
    }

    return null;
  };

  GLSLX.Folder._foldName = function(node) {
    var symbol = node.symbol;

    if (symbol != null && symbol.isConst()) {
      if (symbol.constantValue != null) {
        return symbol.constantValue.clone();
      }

      if (symbol.asVariable().kind != GLSLX.VariableKind.ARGUMENT) {
        return new GLSLX.Node(GLSLX.NodeKind.UNKNOWN_CONSTANT).withType(node.resolvedType);
      }
    }

    return null;
  };

  GLSLX.Folder._foldSequence = function(node) {
    for (var child = node.firstChild(); child != null; child = child.nextSibling()) {
      var folded = GLSLX.Folder.fold(child);

      if (folded == null || child == node.lastChild()) {
        return folded;
      }
    }

    return null;
  };

  GLSLX.Folder._foldHook = function(node) {
    var foldedTest = GLSLX.Folder.fold(node.hookTest());
    var foldedTrue = GLSLX.Folder.fold(node.hookTrue());
    var foldedFalse = GLSLX.Folder.fold(node.hookFalse());

    if (foldedTest != null && foldedTest.kind == GLSLX.NodeKind.BOOL && foldedTrue != null && foldedFalse != null) {
      return foldedTest.asBool() ? foldedTrue : foldedFalse;
    }

    return null;
  };

  GLSLX.Folder._foldDot = function(node) {
    var folded = GLSLX.Folder.fold(node.dotTarget());

    if (folded != null && folded.kind == GLSLX.NodeKind.CALL) {
      var resolvedType = folded.resolvedType;
      var name = node.asString();

      // Evaluate a swizzle
      if (resolvedType.isVector()) {
        var count = name.length;
        var componentCount = resolvedType.componentCount();

        // Find the swizzle set
        for (var i2 = 0, list = GLSLX.Swizzle.strings(componentCount), count2 = list.length; i2 < count2; i2 = i2 + 1 | 0) {
          var set = in_List.get(list, i2);

          if (set.indexOf(in_string.get(name, 0)) != -1) {
            if (count == 1) {
              return folded.childAt(1 + set.indexOf(name) | 0).remove();
            }

            var swizzleType = GLSLX.Swizzle.type(resolvedType.componentType(), count);
            var result = GLSLX.Node.createConstructorCall(swizzleType);

            for (var i = 0, count1 = count; i < count1; i = i + 1 | 0) {
              result.appendChild(folded.childAt(1 + set.indexOf(in_string.get(name, i)) | 0).clone());
            }

            return result;
          }
        }
      }

      // Evaluate a struct field
      else if (resolvedType.symbol != null && resolvedType.symbol.isStruct()) {
        var symbol = resolvedType.symbol.asStruct();
        var variables = symbol.variables;
        assert(folded.childCount() == (1 + variables.length | 0));

        // Extract the field from the constructor call
        for (var i1 = 0, count3 = variables.length; i1 < count3; i1 = i1 + 1 | 0) {
          var variable = in_List.get(variables, i1);

          if (variable.name == name) {
            return folded.childAt(1 + i1 | 0).remove();
          }
        }
      }
    }

    return null;
  };

  GLSLX.Folder._foldIndex = function(node) {
    var foldedLeft = GLSLX.Folder.fold(node.binaryLeft());
    var foldedRight = GLSLX.Folder.fold(node.binaryRight());

    // Both children must also be constants
    if (foldedLeft != null && foldedLeft.kind == GLSLX.NodeKind.CALL && foldedRight != null && foldedRight.kind == GLSLX.NodeKind.INT) {
      var type = foldedLeft.resolvedType;

      if (type.isVector()) {
        var indexCount = type.indexCount();
        var index = foldedRight.asInt();

        // The index must be in range
        if (0 <= index && index < indexCount) {
          return foldedLeft.childAt(index + 1 | 0).remove();
        }
      }

      // Indexing into a matrix creates a vector
      else if (type.isMatrix()) {
        var indexCount1 = type.indexCount();
        var index1 = foldedRight.asInt();
        assert(foldedLeft.childCount() == (1 + __imul(indexCount1, indexCount1) | 0));

        // The index must be in range
        if (0 <= index1 && index1 < indexCount1) {
          var indexType = type.indexType();
          var result = GLSLX.Node.createConstructorCall(indexType);
          var before = foldedLeft.childAt(__imul(index1, indexCount1));

          for (var i = 0, count = indexCount1; i < count; i = i + 1 | 0) {
            result.appendChild(before.nextSibling().remove());
          }

          return result;
        }
      }
    }

    return null;
  };

  GLSLX.Folder._foldCall = function(node) {
    var target = node.callTarget();

    // Only constructor calls are considered constants
    if (target.kind != GLSLX.NodeKind.TYPE) {
      return null;
    }

    var type = target.resolvedType;
    var componentType = type.componentType();
    var matrixStride = 0;
    var $arguments = [];
    var count = 0;

    // Make sure all arguments are constants
    for (var child = target.nextSibling(); child != null; child = child.nextSibling()) {
      var folded = GLSLX.Folder.fold(child);

      if (folded == null) {
        return null;
      }

      // Expand values inline from constructed native types
      if (folded.kind == GLSLX.NodeKind.CALL && componentType != null && folded.callTarget().resolvedType.componentType() != null) {
        for (var value = folded.callTarget().nextSibling(); value != null; value = value.nextSibling()) {
          var casted = GLSLX.Folder._castValue(componentType, value);

          if (casted == null) {
            return null;
          }

          $arguments.push(casted);
        }
      }

      // Auto-cast values for primitive types
      else {
        if (componentType != null) {
          folded = GLSLX.Folder._castValue(componentType, folded);

          if (folded == null) {
            return null;
          }
        }

        $arguments.push(folded);
      }

      if (folded.resolvedType.isMatrix()) {
        matrixStride = folded.resolvedType.indexCount();
      }

      count = count + 1 | 0;
    }

    // If a matrix argument is given to a matrix constructor, it is an error
    // to have any other arguments
    if (type.isMatrix() && matrixStride != 0 && count != 1) {
      return null;
    }

    // Native component-based types
    if (type.componentType() != null) {
      return GLSLX.Folder._foldComponentConstructor($arguments, type, type.isMatrix() ? matrixStride : 0);
    }

    // User-defined struct types
    if (type.symbol != null && type.symbol.isStruct()) {
      return GLSLX.Folder._foldStruct($arguments, type);
    }

    return null;
  };

  GLSLX.Folder._floatValues = function(node) {
    var values = [];

    for (var child = node.callTarget().nextSibling(); child != null; child = child.nextSibling()) {
      values.push(child.asFloat());
    }

    return values;
  };

  GLSLX.Folder._foldMultiply = function(node) {
    var ref;
    var left = GLSLX.Folder.fold(node.binaryLeft());
    var right = GLSLX.Folder.fold(node.binaryRight());
    var leftType = left != null ? left.resolvedType : null;
    var rightType = right != null ? right.resolvedType : null;

    if (left != null && right != null) {
      // Vector-matrix multiply
      if (leftType == GLSLX.Type.VEC2 && rightType == GLSLX.Type.MAT2 || leftType == GLSLX.Type.VEC3 && rightType == GLSLX.Type.MAT3 || leftType == GLSLX.Type.VEC4 && rightType == GLSLX.Type.MAT4) {
        var stride = leftType.indexCount();
        var result = GLSLX.Node.createConstructorCall(leftType);
        var leftValues = GLSLX.Folder._floatValues(left);
        var rightValues = GLSLX.Folder._floatValues(right);

        for (var i = 0, count1 = stride; i < count1; i = i + 1 | 0) {
          var total = 0;

          for (var col = 0, count = stride; col < count; col = col + 1 | 0) {
            total += in_List.get(leftValues, col) * in_List.get(rightValues, col + __imul(i, stride) | 0);
          }

          result.appendChild(new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(total).withType(GLSLX.Type.FLOAT));
        }

        return result;
      }

      // Matrix-vector multiply
      if (leftType == GLSLX.Type.MAT2 && rightType == GLSLX.Type.VEC2 || leftType == GLSLX.Type.MAT3 && rightType == GLSLX.Type.VEC3 || leftType == GLSLX.Type.MAT4 && rightType == GLSLX.Type.VEC4) {
        var stride1 = leftType.indexCount();
        var result1 = GLSLX.Node.createConstructorCall(rightType);
        var leftValues1 = GLSLX.Folder._floatValues(left);
        var rightValues1 = GLSLX.Folder._floatValues(right);

        for (var i1 = 0, count3 = stride1; i1 < count3; i1 = i1 + 1 | 0) {
          var total1 = 0;

          for (var row = 0, count2 = stride1; row < count2; row = row + 1 | 0) {
            total1 += in_List.get(leftValues1, i1 + __imul(row, stride1) | 0) * in_List.get(rightValues1, row);
          }

          result1.appendChild(new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(total1).withType(GLSLX.Type.FLOAT));
        }

        return result1;
      }

      // Matrix-matrix multiply
      if (leftType.isMatrix() && rightType == leftType) {
        var stride2 = leftType.indexCount();
        var result2 = GLSLX.Node.createConstructorCall(leftType);
        var leftValues2 = GLSLX.Folder._floatValues(left);
        var rightValues2 = GLSLX.Folder._floatValues(right);

        for (var row1 = 0, count6 = stride2; row1 < count6; row1 = row1 + 1 | 0) {
          for (var col1 = 0, count5 = stride2; col1 < count5; col1 = col1 + 1 | 0) {
            var total2 = 0;

            for (var i2 = 0, count4 = stride2; i2 < count4; i2 = i2 + 1 | 0) {
              total2 += in_List.get(leftValues2, col1 + __imul(i2, stride2) | 0) * in_List.get(rightValues2, i2 + __imul(row1, stride2) | 0);
            }

            result2.appendChild(new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(total2).withType(GLSLX.Type.FLOAT));
          }
        }

        return result2;
      }

      return (ref = GLSLX.Folder._foldFloat2(left, right, function(a, b) {
        return a * b;
      })) != null ? ref : GLSLX.Folder._foldInt2(left, right, function(a, b) {
        return __imul(a, b);
      });
    }

    return null;
  };

  GLSLX.Folder._castValue = function(type, node) {
    var value = 0;

    switch (node.kind) {
      case GLSLX.NodeKind.BOOL: {
        value = +node.asBool();
        break;
      }

      case GLSLX.NodeKind.INT: {
        value = node.asInt();
        break;
      }

      case GLSLX.NodeKind.FLOAT: {
        value = node.asFloat();
        break;
      }

      default: {
        return null;
      }
    }

    switch (type) {
      case GLSLX.Type.BOOL: {
        return new GLSLX.Node(GLSLX.NodeKind.BOOL).withBool(!!value).withType(GLSLX.Type.BOOL);
      }

      case GLSLX.Type.INT: {
        return new GLSLX.Node(GLSLX.NodeKind.INT).withInt(value | 0).withType(GLSLX.Type.INT);
      }

      case GLSLX.Type.FLOAT: {
        return new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(value).withType(GLSLX.Type.FLOAT);
      }
    }

    return null;
  };

  GLSLX.Folder._foldComponentConstructor = function($arguments, type, matrixStride) {
    var componentCount = type.componentCount();
    var componentType = type.componentType();
    var node = GLSLX.Node.createConstructorCall(type);
    assert(componentCount > 0);

    // Passing a single component as an argument always works
    if ($arguments.length == 1) {
      var argument = in_List.first($arguments);

      if (argument.resolvedType != componentType) {
        return null;
      }

      // When doing this with a matrix, only the diagonal is filled
      var isMatrix = type.isMatrix();
      var stride = type.indexCount();

      // Fill the target by repeating the single component
      for (var i = 0, count = componentCount; i < count; i = i + 1 | 0) {
        var isOffMatrixDiagonal = isMatrix && (i % (stride + 1 | 0) | 0) != 0;
        node.appendChild(isOffMatrixDiagonal ? new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(0).withType(GLSLX.Type.FLOAT) : argument.clone());
      }
    }

    // If a matrix is constructed from a matrix, then each component (column i,
    // row j) in the result that has a corresponding component (column i, row j)
    // in the argument will be initialized from there. All other components will
    // be initialized to the identity matrix.
    else if (matrixStride != 0) {
      var stride1 = type.indexCount();
      assert(type.isMatrix());
      assert(__imul(stride1, stride1) == componentCount);

      for (var row = 0, count2 = stride1; row < count2; row = row + 1 | 0) {
        for (var col = 0, count1 = stride1; col < count1; col = col + 1 | 0) {
          node.appendChild(col < matrixStride && row < matrixStride ? in_List.get($arguments, col + __imul(row, matrixStride) | 0) : new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(col == row ? 1 : 0).withType(GLSLX.Type.FLOAT));
        }
      }
    }

    // Multiple arguments are more involved
    else {
      // Extra arguments are ignored
      if ($arguments.length < componentCount) {
        return null;
      }

      // The constructed value is represented as a constructor call
      for (var i1 = 0, count3 = componentCount; i1 < count3; i1 = i1 + 1 | 0) {
        var argument1 = in_List.get($arguments, i1);

        // All casts should be resolved by this point
        if (argument1.resolvedType != componentType) {
          return null;
        }

        node.appendChild(argument1);
      }
    }

    // Don't wrap primitive types
    if (type.indexType() == null) {
      return node.lastChild().remove();
    }

    return node;
  };

  GLSLX.Folder._foldStruct = function($arguments, type) {
    var variables = type.symbol.asStruct().variables;
    var node = GLSLX.Node.createConstructorCall(type);

    // Structs can only be constructed with the exact number of arguments
    if ($arguments.length != variables.length) {
      return null;
    }

    // The constructed value is represented as a constructor call
    for (var i = 0, count = $arguments.length; i < count; i = i + 1 | 0) {
      if (in_List.get($arguments, i).resolvedType != in_List.get(variables, i).type.resolvedType) {
        return null;
      }

      node.appendChild(in_List.get($arguments, i));
    }

    return node;
  };

  GLSLX.Folder._foldBinaryEquality = function(node) {
    var left = GLSLX.Folder.fold(node.binaryLeft());
    var right = GLSLX.Folder.fold(node.binaryRight());

    if (left != null && right != null) {
      var value = left.looksTheSameAs(right);
      return new GLSLX.Node(GLSLX.NodeKind.BOOL).withBool(node.kind == GLSLX.NodeKind.EQUAL ? value : !value).withType(GLSLX.Type.BOOL);
    }

    return null;
  };

  GLSLX.Folder._foldComponentwiseUnary = function(node, componentType, argumentKind, op) {
    if (node.kind == GLSLX.NodeKind.CALL && node.callTarget().kind == GLSLX.NodeKind.TYPE && node.callTarget().resolvedType.componentType() == componentType) {
      var result = GLSLX.Node.createConstructorCall(node.callTarget().resolvedType);

      for (var child = node.callTarget().nextSibling(); child != null; child = child.nextSibling()) {
        var folded = GLSLX.Folder.fold(child);

        if (folded == null || folded.kind != argumentKind) {
          return null;
        }

        result.appendChild(op(folded));
      }

      return result;
    }

    return null;
  };

  GLSLX.Folder._foldFloat1 = function(node, op) {
    if (node.kind == GLSLX.NodeKind.FLOAT) {
      return new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(op(node.asFloat())).withType(GLSLX.Type.FLOAT);
    }

    return GLSLX.Folder._foldComponentwiseUnary(node, GLSLX.Type.FLOAT, GLSLX.NodeKind.FLOAT, function(x) {
      return new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(op(x.asFloat())).withType(GLSLX.Type.FLOAT);
    });
  };

  GLSLX.Folder._foldInt1 = function(node, op) {
    if (node.kind == GLSLX.NodeKind.INT) {
      return new GLSLX.Node(GLSLX.NodeKind.INT).withInt(op(node.asInt())).withType(GLSLX.Type.INT);
    }

    return GLSLX.Folder._foldComponentwiseUnary(node, GLSLX.Type.INT, GLSLX.NodeKind.INT, function(x) {
      return new GLSLX.Node(GLSLX.NodeKind.INT).withInt(op(x.asInt())).withType(GLSLX.Type.INT);
    });
  };

  GLSLX.Folder._foldComponentwiseBinary = function(left, right, componentType, argumentKind, op) {
    var leftHasComponents = left.kind == GLSLX.NodeKind.CALL && left.callTarget().kind == GLSLX.NodeKind.TYPE && left.callTarget().resolvedType.componentType() == componentType;
    var rightHasComponents = right.kind == GLSLX.NodeKind.CALL && right.callTarget().kind == GLSLX.NodeKind.TYPE && right.callTarget().resolvedType.componentType() == componentType;

    // Vector-vector binary operator
    if (leftHasComponents && rightHasComponents && right.resolvedType == left.resolvedType) {
      var result = GLSLX.Node.createConstructorCall(left.resolvedType);
      var leftChild = left.callTarget().nextSibling();
      var rightChild = right.callTarget().nextSibling();

      while (leftChild != null && rightChild != null) {
        var foldedLeft = GLSLX.Folder.fold(leftChild);
        var foldedRight = GLSLX.Folder.fold(rightChild);

        if (foldedLeft == null || foldedLeft.kind != argumentKind || foldedRight == null || foldedRight.kind != argumentKind) {
          return null;
        }

        result.appendChild(op(foldedLeft, foldedRight));
        leftChild = leftChild.nextSibling();
        rightChild = rightChild.nextSibling();
      }

      if (leftChild == null && rightChild == null) {
        return result;
      }
    }

    // Vector-scalar binary operator
    else if (leftHasComponents && right.kind == argumentKind) {
      var result1 = GLSLX.Node.createConstructorCall(left.resolvedType);

      for (var child = left.callTarget().nextSibling(); child != null; child = child.nextSibling()) {
        var folded = GLSLX.Folder.fold(child);

        if (folded == null || folded.kind != argumentKind) {
          return null;
        }

        result1.appendChild(op(folded, right));
      }

      return result1;
    }

    // Scalar-vector binary operator
    else if (left.kind == argumentKind && rightHasComponents) {
      var result2 = GLSLX.Node.createConstructorCall(right.resolvedType);

      for (var child1 = right.callTarget().nextSibling(); child1 != null; child1 = child1.nextSibling()) {
        var folded1 = GLSLX.Folder.fold(child1);

        if (folded1 == null || folded1.kind != argumentKind) {
          return null;
        }

        result2.appendChild(op(left, folded1));
      }

      return result2;
    }

    return null;
  };

  GLSLX.Folder._foldFloat2 = function(left, right, op) {
    if (left.kind == GLSLX.NodeKind.FLOAT && right.kind == GLSLX.NodeKind.FLOAT) {
      return new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(op(left.asFloat(), right.asFloat())).withType(GLSLX.Type.FLOAT);
    }

    return GLSLX.Folder._foldComponentwiseBinary(left, right, GLSLX.Type.FLOAT, GLSLX.NodeKind.FLOAT, function(a, b) {
      return new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(op(a.asFloat(), b.asFloat())).withType(GLSLX.Type.FLOAT);
    });
  };

  GLSLX.Folder._foldInt2 = function(left, right, op) {
    if (left.kind == GLSLX.NodeKind.INT && right.kind == GLSLX.NodeKind.INT) {
      return new GLSLX.Node(GLSLX.NodeKind.INT).withInt(op(left.asInt(), right.asInt())).withType(GLSLX.Type.INT);
    }

    return GLSLX.Folder._foldComponentwiseBinary(left, right, GLSLX.Type.INT, GLSLX.NodeKind.INT, function(a, b) {
      return new GLSLX.Node(GLSLX.NodeKind.INT).withInt(op(a.asInt(), b.asInt())).withType(GLSLX.Type.INT);
    });
  };

  GLSLX.Folder._foldUnaryBool = function(node, op) {
    var value = GLSLX.Folder.fold(node.unaryValue());

    if (value != null && value.kind == GLSLX.NodeKind.BOOL) {
      return new GLSLX.Node(GLSLX.NodeKind.BOOL).withBool(op(value.asBool())).withType(GLSLX.Type.BOOL);
    }

    return null;
  };

  GLSLX.Folder._foldUnaryFloatOrInt = function(node, floatOp, intOp) {
    var ref;
    var value = GLSLX.Folder.fold(node.unaryValue());

    if (value != null) {
      return (ref = GLSLX.Folder._foldFloat1(value, floatOp)) != null ? ref : GLSLX.Folder._foldInt1(value, intOp);
    }

    return null;
  };

  GLSLX.Folder._foldBinaryBool = function(node, op) {
    var left = GLSLX.Folder.fold(node.binaryLeft());
    var right = GLSLX.Folder.fold(node.binaryRight());

    if (left != null && right != null && left.kind == GLSLX.NodeKind.BOOL && right.kind == GLSLX.NodeKind.BOOL) {
      return new GLSLX.Node(GLSLX.NodeKind.BOOL).withBool(op(left.asBool(), right.asBool())).withType(GLSLX.Type.BOOL);
    }

    return null;
  };

  GLSLX.Folder._foldBinaryFloatOrInt = function(node, floatOp, intOp) {
    var ref;
    var left = GLSLX.Folder.fold(node.binaryLeft());
    var right = GLSLX.Folder.fold(node.binaryRight());

    if (left != null && right != null) {
      return (ref = GLSLX.Folder._foldFloat2(left, right, floatOp)) != null ? ref : GLSLX.Folder._foldInt2(left, right, intOp);
    }

    return null;
  };

  GLSLX.Folder._foldBinaryFloatOrIntToBool = function(node, op) {
    var left = GLSLX.Folder.fold(node.binaryLeft());
    var right = GLSLX.Folder.fold(node.binaryRight());

    // The comparison operators only work on scalars in GLSL. To do comparisons
    // on vectors, the functions greaterThan(), lessThan(), greaterThanEqual(),
    // and lessThanEqual() must be used.
    if (left != null && right != null) {
      if (left.kind == GLSLX.NodeKind.FLOAT && right.kind == GLSLX.NodeKind.FLOAT) {
        return new GLSLX.Node(GLSLX.NodeKind.BOOL).withBool(op(left.asFloat(), right.asFloat())).withType(GLSLX.Type.BOOL);
      }

      if (left.kind == GLSLX.NodeKind.INT && right.kind == GLSLX.NodeKind.INT) {
        return new GLSLX.Node(GLSLX.NodeKind.BOOL).withBool(op(left.asInt(), right.asInt())).withType(GLSLX.Type.BOOL);
      }
    }

    return null;
  };

  GLSLX.DiagnosticKind = {
    ERROR: 0,
    WARNING: 1
  };

  GLSLX.Diagnostic = function(kind, range, text) {
    this.kind = kind;
    this.range = range;
    this.text = text;
    this.noteRange = null;
    this.noteText = '';
  };

  GLSLX.Log = function() {
    this.diagnostics = [];
    this.warningCount = 0;
    this.errorCount = 0;
  };

  GLSLX.Log.prototype.hasErrors = function() {
    return this.errorCount != 0;
  };

  GLSLX.Log.prototype.error = function(range, text) {
    this.diagnostics.push(new GLSLX.Diagnostic(GLSLX.DiagnosticKind.ERROR, range, text));
    this.errorCount = this.errorCount + 1 | 0;
  };

  GLSLX.Log.prototype.warning = function(range, text) {
    this.diagnostics.push(new GLSLX.Diagnostic(GLSLX.DiagnosticKind.WARNING, range, text));
    this.warningCount = this.warningCount + 1 | 0;
  };

  GLSLX.Log.prototype.note = function(range, text) {
    var last = in_List.last(this.diagnostics);
    last.noteRange = range;
    last.noteText = text;
  };

  GLSLX.Log.prototype.syntaxWarningUnknownExtension = function(range, name) {
    this.warning(range, 'The extension "' + name + '" is not in the known list of valid WebGL extensions');
  };

  GLSLX.Log.prototype.syntaxErrorInvalidString = function(range) {
    this.error(range, 'Invalid string literal');
  };

  GLSLX.Log.prototype.syntaxErrorDisabledExtension = function(range, name, extension) {
    this.error(range, 'Cannot use "' + name + '" from disabled extension "' + extension + '"');
  };

  GLSLX.Log.prototype.syntaxErrorExtraData = function(range, text) {
    this.error(range, 'Syntax error "' + text + '"');
  };

  GLSLX.Log.prototype.syntaxErrorReservedWord = function(range) {
    this.error(range, '"' + range.toString() + '" is a reserved word');
  };

  GLSLX.Log.prototype.syntaxErrorUnexpectedToken = function(token) {
    this.error(token.range, 'Unexpected ' + in_List.get(GLSLX.in_TokenKind._strings, token.kind));
  };

  GLSLX.Log.prototype.syntaxErrorExpectedToken1 = function(range, expected) {
    this.error(range, 'Expected ' + in_List.get(GLSLX.in_TokenKind._strings, expected));
  };

  GLSLX.Log.prototype.syntaxErrorExpectedToken2 = function(range, found, expected) {
    this.error(range, 'Expected ' + in_List.get(GLSLX.in_TokenKind._strings, expected) + ' but found ' + in_List.get(GLSLX.in_TokenKind._strings, found));
  };

  GLSLX.Log.prototype.syntaxErrorBadSymbolReference = function(range) {
    this.error(range, 'There is no symbol called "' + range.toString() + '" in the current scope');
  };

  GLSLX.Log.prototype.syntaxErrorDuplicateSymbolDefinition = function(range, previous) {
    this.error(range, 'There is already a symbol called "' + range.toString() + '" in the current scope');
    this.note(previous, 'The previous definition of "' + previous.toString() + '" is here');
  };

  GLSLX.Log.prototype.syntaxErrorOutsideLoop = function(range) {
    this.error(range, 'This statement cannot be used outside a loop');
  };

  GLSLX.Log.prototype.syntaxErrorStructVariableInitializer = function(range) {
    this.error(range, 'Cannot initialize struct variables');
  };

  GLSLX.Log.prototype.syntaxErrorInsideStruct = function(range) {
    this.error(range, 'This statement cannot be used inside a struct');
  };

  GLSLX.Log.prototype.syntaxErrorInsideFunction = function(range) {
    this.error(range, 'This statement cannot be used inside a function');
  };

  GLSLX.Log.prototype.syntaxErrorOutsideFunction = function(range) {
    this.error(range, 'This statement cannot be used outside a function');
  };

  GLSLX.Log.prototype.semanticErrorIncludeWithoutFileAccess = function(range) {
    this.error(range, 'Cannot include files without access to a file system');
  };

  GLSLX.Log.prototype.semanticErrorIncludeBadPath = function(range, path) {
    this.error(range, 'Cannot read the file ' + JSON.stringify(path));
  };

  GLSLX.Log.prototype.syntaxErrorDifferentReturnType = function(range, name, type, expected, previous) {
    this.error(range, 'Cannot change the return type of "' + name + '" to type "' + type.toString() + '"');
    this.note(previous, 'The forward declaration of "' + name + '" has a return type of "' + expected.toString() + '"');
  };

  GLSLX.Log.prototype.syntaxErrorBadQualifier = function(range) {
    this.error(range, 'Cannot use this qualifier here');
  };

  GLSLX.Log.prototype.syntaxErrorConstantRequired = function(range) {
    this.error(range, 'This value must be a compile-time constant');
  };

  GLSLX.Log.prototype.syntaxErrorInvalidArraySize = function(range, count) {
    this.error(range, 'Cannot declare an array with a size of "' + count.toString() + '"');
  };

  GLSLX.Log.prototype.syntaxErrorMissingArraySize = function(range) {
    this.error(range, 'All array sizes must be specified');
  };

  GLSLX.Log.prototype.syntaxErrorMultidimensionalArray = function(range) {
    this.error(range, 'Multidimensional arrays are not a part of the language');
  };

  GLSLX.Log.prototype.syntaxErrorInvalidOperator = function(range) {
    this.error(range, 'The operator "' + range.toString() + '" is reserved and cannot be used');
  };

  GLSLX.Log.prototype.semanticErrorBadConversion = function(range, from, to) {
    this.error(range, 'Cannot convert from type "' + from.toString() + '" to type "' + to.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorUnexpectedType = function(range, type) {
    this.error(range, 'Unexpected type "' + type.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorBadVariableType = function(range, type) {
    this.error(range, 'Cannot create a variable of type "' + type.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorBadMember = function(range, type, name) {
    this.error(range, 'Cannot find "' + name + '" on type "' + type.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorBadSwizzle = function(range, type, name) {
    this.error(range, 'Invalid swizzle "' + name + '" on type "' + type.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorBadSwizzleAssignment = function(range, field) {
    this.error(range, 'The field "' + field + '" cannot be specified multiple times when used as a storage location');
  };

  GLSLX.Log.prototype.semanticErrorMustCallFunction = function(range, name) {
    this.error(range, 'The function "' + name + '" must be called');
  };

  GLSLX.Log.prototype.semanticErrorBadCall = function(range, type) {
    this.error(range, 'Cannot call type "' + type.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorBadConstructorValue = function(range, type, $constructor) {
    this.error(range, 'Cannot use value of type "' + type.toString() + '" when constructing type "' + $constructor.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorExtraConstructorValue = function(range, type, count, total) {
    this.error(range, 'The constructor for type "' + type.toString() + '" only takes ' + count.toString() + ' argument' + (count != 1 ? 's' : '') + ' and this argument would bring the total to ' + total.toString());
  };

  GLSLX.Log.prototype.semanticErrorBadConstructorCount = function(range, type, count) {
    this.error(range, 'Cannot construct type "' + type.toString() + '" with ' + count.toString() + ' argument' + (count != 1 ? 's' : ''));
  };

  GLSLX.Log.prototype.semanticErrorArgumentCountFunction = function(range, expected, found, name, $function) {
    this.error(range, 'Expected ' + expected.toString() + ' argument' + (expected != 1 ? 's' : '') + ' but found ' + found.toString() + ' argument' + (found != 1 ? 's' : '') + ' when calling function "' + name + '"');

    if ($function != null) {
      this.note($function, 'The definition of function "' + name + '" is here');
    }
  };

  GLSLX.Log.prototype.semanticErrorArgumentCountConstructor = function(range, expected, found, name, struct) {
    this.error(range, 'Expected ' + expected.toString() + ' argument' + (expected != 1 ? 's' : '') + ' but found ' + found.toString() + ' argument' + (found != 1 ? 's' : '') + ' when constructing type "' + name + '"');

    if (struct != null) {
      this.note(struct, 'The definition of struct "' + name + '" is here');
    }
  };

  GLSLX.Log.prototype.semanticErrorBadOverloadMatch = function(range, name) {
    this.error(range, 'No matching overload for function "' + name + '"');
  };

  GLSLX.Log.prototype.semanticErrorBadHookTypes = function(range, left, right) {
    this.error(range, 'Cannot merge type "' + left.toString() + '" and type "' + right.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorArrayHook = function(range, type) {
    if (type.isArrayOf != null) {
      this.error(range, 'Cannot use a conditional expression with array type "' + type.toString() + '"');
    }

    else {
      this.error(range, 'Cannot use a conditional expression with type "' + type.toString() + '" because it contains an array');
    }
  };

  GLSLX.Log.prototype.semanticErrorArrayAssignment = function(range, type) {
    if (type.isArrayOf != null) {
      this.error(range, 'Cannot assign to array type "' + type.toString() + '"');
    }

    else {
      this.error(range, 'Cannot assign to type "' + type.toString() + '" because it contains an array');
    }
  };

  GLSLX.Log.prototype.semanticErrorBadUnaryOperator = function(range, operator, type) {
    this.error(range, 'No unary operator "' + operator + '" for type "' + type.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorBadBinaryOperator = function(range, operator, left, right) {
    if (left == right) {
      this.error(range, 'There is no operator "' + operator + '" defined for type "' + left.toString() + '"');
    }

    else {
      this.error(range, 'No binary operator "' + operator + '" for type "' + left.toString() + '" and type "' + right.toString() + '"');
    }
  };

  GLSLX.Log.prototype.semanticErrorBadIndex = function(range, left, right) {
    this.error(range, 'No index operator for type "' + left.toString() + '" and type "' + right.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorOutOfBoundsIndex = function(range, value, type) {
    this.error(range, 'Index "' + value.toString() + '" is out of bounds for type "' + type.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorBadStorage = function(range) {
    this.error(range, 'Cannot store to this location');
  };

  GLSLX.Log.prototype.semanticErrorUninitializedConstant = function(range) {
    this.error(range, 'Constants must be initialized');
  };

  GLSLX.Log.prototype.semanticErrorMissingReturn = function(range, name, type) {
    this.error(range, 'All control paths for "' + name + '" must return a value of type "' + type.toString() + '"');
  };

  GLSLX.Log.prototype.semanticErrorBadMatrixConstructor = function(range) {
    this.error(range, 'If a matrix argument is given to a matrix constructor, it is an error to have any other arguments');
  };

  GLSLX.NodeKind = {
    // Other
    GLOBAL: 0,
    STRUCT_BLOCK: 1,
    VARIABLE: 2,

    // Statements
    BLOCK: 3,
    BREAK: 4,
    CONTINUE: 5,
    DISCARD: 6,
    DO_WHILE: 7,
    EXPRESSION: 8,
    EXTENSION: 9,
    FOR: 10,
    FUNCTION: 11,
    IF: 12,
    MODIFIER_BLOCK: 13,
    PRECISION: 14,
    RETURN: 15,
    STRUCT: 16,
    VARIABLES: 17,
    VERSION: 18,
    WHILE: 19,

    // Expressions
    CALL: 20,
    DOT: 21,
    HOOK: 22,
    NAME: 23,
    PARSE_ERROR: 24,
    SEQUENCE: 25,
    TYPE: 26,
    UNKNOWN_CONSTANT: 27,

    // Literals
    BOOL: 28,
    FLOAT: 29,
    INT: 30,

    // Unary prefix
    NEGATIVE: 31,
    NOT: 32,
    POSITIVE: 33,

    // Unary prefix assign
    PREFIX_DECREMENT: 34,
    PREFIX_INCREMENT: 35,

    // Unary postfix assign
    POSTFIX_DECREMENT: 36,
    POSTFIX_INCREMENT: 37,

    // Binary
    ADD: 38,
    DIVIDE: 39,
    EQUAL: 40,
    GREATER_THAN: 41,
    GREATER_THAN_OR_EQUAL: 42,
    INDEX: 43,
    LESS_THAN: 44,
    LESS_THAN_OR_EQUAL: 45,
    LOGICAL_AND: 46,
    LOGICAL_OR: 47,
    LOGICAL_XOR: 48,
    MULTIPLY: 49,
    NOT_EQUAL: 50,
    SUBTRACT: 51,

    // Binary assignment
    ASSIGN: 52,
    ASSIGN_ADD: 53,
    ASSIGN_DIVIDE: 54,
    ASSIGN_MULTIPLY: 55,
    ASSIGN_SUBTRACT: 56
  };

  GLSLX.Node = function(kind) {
    this.id = GLSLX.Node._createID();
    this.kind = kind;
    this.range = null;
    this.internalRange = null;
    this.symbol = null;
    this.resolvedType = null;
    this._literal = 0;
    this._text = null;
    this._parent = null;
    this._firstChild = null;
    this._lastChild = null;
    this._previousSibling = null;
    this._nextSibling = null;
    this.hasControlFlowAtEnd = false;
  };

  GLSLX.Node.prototype._copyMembersFrom = function(node) {
    this.kind = node.kind;
    this.range = node.range;
    this.internalRange = node.internalRange;
    this.symbol = node.symbol;
    this.resolvedType = node.resolvedType;
    this._literal = node._literal;
    this._text = node._text;
  };

  GLSLX.Node.prototype.cloneWithoutChildren = function() {
    var clone = new GLSLX.Node(this.kind);
    clone._copyMembersFrom(this);
    return clone;
  };

  GLSLX.Node.prototype.clone = function() {
    var clone = this.cloneWithoutChildren();

    for (var child = this._firstChild; child != null; child = child._nextSibling) {
      clone.appendChild(child.clone());
    }

    return clone;
  };

  GLSLX.Node.prototype.parent = function() {
    return this._parent;
  };

  GLSLX.Node.prototype.firstChild = function() {
    return this._firstChild;
  };

  GLSLX.Node.prototype.lastChild = function() {
    return this._lastChild;
  };

  GLSLX.Node.prototype.nextSibling = function() {
    return this._nextSibling;
  };

  // This is cheaper than childCount == 0
  GLSLX.Node.prototype.hasChildren = function() {
    return this._firstChild != null;
  };

  GLSLX.Node.prototype.childCount = function() {
    var count = 0;

    for (var child = this._firstChild; child != null; child = child._nextSibling) {
      count = count + 1 | 0;
    }

    return count;
  };

  GLSLX.Node.prototype.childAt = function(index) {
    assert(0 <= index && index < this.childCount());
    var child = this._firstChild;

    while (index != 0) {
      child = child._nextSibling;
      index = index - 1 | 0;
    }

    return child;
  };

  GLSLX.Node.prototype.withType = function(value) {
    this.resolvedType = value;
    return this;
  };

  GLSLX.Node.prototype.withSymbol = function(value) {
    this.symbol = value;
    return this;
  };

  GLSLX.Node.prototype.withBool = function(value) {
    this._literal = +value;
    return this;
  };

  GLSLX.Node.prototype.withInt = function(value) {
    this._literal = value;
    return this;
  };

  GLSLX.Node.prototype.withFloat = function(value) {
    this._literal = value;
    return this;
  };

  GLSLX.Node.prototype.withText = function(value) {
    this._text = value;
    return this;
  };

  GLSLX.Node.prototype.withRange = function(value) {
    this.range = value;
    return this;
  };

  GLSLX.Node.prototype.withInternalRange = function(value) {
    this.internalRange = value;
    return this;
  };

  GLSLX.Node.prototype.appendChild = function(node) {
    if (node == null) {
      return this;
    }

    assert(node != this);
    assert(node._parent == null);
    assert(node._previousSibling == null);
    assert(node._nextSibling == null);
    node._parent = this;

    if (this.hasChildren()) {
      node._previousSibling = this._lastChild;
      this._lastChild._nextSibling = node;
      this._lastChild = node;
    }

    else {
      this._lastChild = this._firstChild = node;
    }

    return this;
  };

  GLSLX.Node.prototype.remove = function() {
    assert(this._parent != null);

    if (this._previousSibling != null) {
      assert(this._previousSibling._nextSibling == this);
      this._previousSibling._nextSibling = this._nextSibling;
    }

    else {
      assert(this._parent._firstChild == this);
      this._parent._firstChild = this._nextSibling;
    }

    if (this._nextSibling != null) {
      assert(this._nextSibling._previousSibling == this);
      this._nextSibling._previousSibling = this._previousSibling;
    }

    else {
      assert(this._parent._lastChild == this);
      this._parent._lastChild = this._previousSibling;
    }

    this._parent = null;
    this._previousSibling = null;
    this._nextSibling = null;
    return this;
  };

  GLSLX.Node.prototype.insertChildBefore = function(after, before) {
    if (before == null) {
      return this;
    }

    assert(before != after);
    assert(before._parent == null);
    assert(before._previousSibling == null);
    assert(before._nextSibling == null);
    assert(after == null || after._parent == this);

    if (after == null) {
      return this.appendChild(before);
    }

    before._parent = this;
    before._previousSibling = after._previousSibling;
    before._nextSibling = after;

    if (after._previousSibling != null) {
      assert(after == after._previousSibling._nextSibling);
      after._previousSibling._nextSibling = before;
    }

    else {
      assert(after == this._firstChild);
      this._firstChild = before;
    }

    after._previousSibling = before;
    return this;
  };

  GLSLX.Node.prototype.isTrue = function() {
    return this.kind == GLSLX.NodeKind.BOOL && this.asBool();
  };

  GLSLX.Node.prototype.isFalse = function() {
    return this.kind == GLSLX.NodeKind.BOOL && !this.asBool();
  };

  GLSLX.Node.prototype.isCallTarget = function() {
    return this.parent() != null && this.parent().kind == GLSLX.NodeKind.CALL && this.parent().callTarget() == this;
  };

  GLSLX.Node.prototype.isAssignTarget = function() {
    return this.parent() != null && (GLSLX.in_NodeKind.isUnaryAssign(this.parent().kind) || GLSLX.in_NodeKind.isBinaryAssign(this.parent().kind) && this.parent().binaryLeft() == this);
  };

  GLSLX.Node.prototype.isEmptySequence = function() {
    return this.kind == GLSLX.NodeKind.SEQUENCE && !this.hasChildren();
  };

  GLSLX.Node.prototype.looksTheSameAs = function(node) {
    if (this.kind == node.kind) {
      switch (this.kind) {
        case GLSLX.NodeKind.BOOL: {
          return this.asBool() == node.asBool();
        }

        case GLSLX.NodeKind.FLOAT: {
          return this.asFloat() == node.asFloat();
        }

        case GLSLX.NodeKind.INT: {
          return this.asInt() == node.asInt();
        }

        case GLSLX.NodeKind.NAME: {
          return this.symbol == node.symbol;
        }

        case GLSLX.NodeKind.TYPE: {
          return this.resolvedType == node.resolvedType;
        }

        case GLSLX.NodeKind.DOT: {
          return this.dotTarget().looksTheSameAs(node.dotTarget()) && this.symbol == node.symbol && this.asString() == node.asString();
        }

        case GLSLX.NodeKind.HOOK: {
          return this.hookTest().looksTheSameAs(node.hookTest()) && this.hookTrue().looksTheSameAs(node.hookTrue()) && this.hookFalse().looksTheSameAs(node.hookFalse());
        }

        case GLSLX.NodeKind.CALL: {
          var left = this.firstChild();
          var right = node.firstChild();

          while (left != null && right != null) {
            if (!left.looksTheSameAs(right)) {
              return false;
            }

            left = left.nextSibling();
            right = right.nextSibling();
          }

          return left == null && right == null;
        }

        default: {
          if (GLSLX.in_NodeKind.isUnary(this.kind)) {
            return this.unaryValue().looksTheSameAs(node.unaryValue());
          }

          if (GLSLX.in_NodeKind.isBinary(this.kind)) {
            return this.binaryLeft().looksTheSameAs(node.binaryLeft()) && this.binaryRight().looksTheSameAs(node.binaryRight());
          }
          break;
        }
      }
    }

    return false;
  };

  GLSLX.Node.createDoWhile = function(body, test) {
    assert(GLSLX.in_NodeKind.isStatement(body.kind));
    assert(GLSLX.in_NodeKind.isExpression(test.kind));
    return new GLSLX.Node(GLSLX.NodeKind.DO_WHILE).appendChild(body).appendChild(test);
  };

  GLSLX.Node.createExpression = function(value) {
    assert(GLSLX.in_NodeKind.isExpression(value.kind));
    return new GLSLX.Node(GLSLX.NodeKind.EXPRESSION).appendChild(value);
  };

  GLSLX.Node.createFor = function(setup, test, update, body) {
    assert(setup == null || GLSLX.in_NodeKind.isExpression(setup.kind) || setup.kind == GLSLX.NodeKind.VARIABLES);
    assert(test == null || GLSLX.in_NodeKind.isExpression(test.kind));
    assert(update == null || GLSLX.in_NodeKind.isExpression(update.kind));
    assert(GLSLX.in_NodeKind.isStatement(body.kind));
    return new GLSLX.Node(GLSLX.NodeKind.FOR).appendChild(setup == null ? new GLSLX.Node(GLSLX.NodeKind.SEQUENCE) : setup).appendChild(test == null ? new GLSLX.Node(GLSLX.NodeKind.SEQUENCE) : test).appendChild(update == null ? new GLSLX.Node(GLSLX.NodeKind.SEQUENCE) : update).appendChild(body);
  };

  GLSLX.Node.createIf = function(test, yes, no) {
    assert(GLSLX.in_NodeKind.isExpression(test.kind));
    assert(GLSLX.in_NodeKind.isStatement(yes.kind));
    assert(no == null || GLSLX.in_NodeKind.isStatement(no.kind));
    return new GLSLX.Node(GLSLX.NodeKind.IF).appendChild(test).appendChild(yes).appendChild(no);
  };

  GLSLX.Node.createPrecision = function(flags, type) {
    assert(GLSLX.in_NodeKind.isExpression(type.kind));
    return new GLSLX.Node(GLSLX.NodeKind.PRECISION).withInt(flags).appendChild(type);
  };

  GLSLX.Node.createReturn = function(value) {
    assert(value == null || GLSLX.in_NodeKind.isExpression(value.kind));
    return new GLSLX.Node(GLSLX.NodeKind.RETURN).appendChild(value);
  };

  GLSLX.Node.createStruct = function(symbol, block, variables) {
    assert(block.kind == GLSLX.NodeKind.STRUCT_BLOCK);
    assert(variables == null || variables.kind == GLSLX.NodeKind.VARIABLES);
    return new GLSLX.Node(GLSLX.NodeKind.STRUCT).withSymbol(symbol).appendChild(block).appendChild(variables);
  };

  GLSLX.Node.createVariables = function(flags, type) {
    assert(GLSLX.in_NodeKind.isExpression(type.kind));
    return new GLSLX.Node(GLSLX.NodeKind.VARIABLES).withInt(flags).appendChild(type);
  };

  GLSLX.Node.createWhile = function(test, body) {
    assert(GLSLX.in_NodeKind.isExpression(test.kind));
    assert(GLSLX.in_NodeKind.isStatement(body.kind));
    return new GLSLX.Node(GLSLX.NodeKind.WHILE).appendChild(test).appendChild(body);
  };

  GLSLX.Node.createCall = function(value) {
    assert(GLSLX.in_NodeKind.isExpression(value.kind));
    return new GLSLX.Node(GLSLX.NodeKind.CALL).appendChild(value);
  };

  GLSLX.Node.createConstructorCall = function(type) {
    return GLSLX.Node.createCall(new GLSLX.Node(GLSLX.NodeKind.TYPE).withType(type)).withType(type);
  };

  GLSLX.Node.createDot = function(value, text) {
    assert(GLSLX.in_NodeKind.isExpression(value.kind));
    assert(text != null);
    return new GLSLX.Node(GLSLX.NodeKind.DOT).appendChild(value).withText(text);
  };

  GLSLX.Node.createHook = function(test, yes, no) {
    assert(GLSLX.in_NodeKind.isExpression(test.kind));
    assert(GLSLX.in_NodeKind.isExpression(yes.kind));
    assert(GLSLX.in_NodeKind.isExpression(no.kind));
    return new GLSLX.Node(GLSLX.NodeKind.HOOK).appendChild(test).appendChild(yes).appendChild(no);
  };

  GLSLX.Node.createUnary = function(kind, value) {
    assert(GLSLX.in_NodeKind.isUnary(kind));
    return new GLSLX.Node(kind).appendChild(value);
  };

  GLSLX.Node.createBinary = function(kind, left, right) {
    assert(GLSLX.in_NodeKind.isBinary(kind));
    return new GLSLX.Node(kind).appendChild(left).appendChild(right);
  };

  GLSLX.Node.prototype.doWhileBody = function() {
    assert(this.kind == GLSLX.NodeKind.DO_WHILE);
    assert(this.childCount() == 2);
    assert(GLSLX.in_NodeKind.isStatement(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.doWhileTest = function() {
    assert(this.kind == GLSLX.NodeKind.DO_WHILE);
    assert(this.childCount() == 2);
    assert(GLSLX.in_NodeKind.isExpression(this._lastChild.kind));
    return this._lastChild;
  };

  GLSLX.Node.prototype.expressionValue = function() {
    assert(this.kind == GLSLX.NodeKind.EXPRESSION);
    assert(this.childCount() == 1);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.forSetup = function() {
    assert(this.kind == GLSLX.NodeKind.FOR);
    assert(this.childCount() == 4);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind) || this._firstChild.kind == GLSLX.NodeKind.VARIABLES);
    return this._firstChild.isEmptySequence() ? null : this._firstChild;
  };

  GLSLX.Node.prototype.forTest = function() {
    assert(this.kind == GLSLX.NodeKind.FOR);
    assert(this.childCount() == 4);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild._nextSibling.kind) || this._firstChild._nextSibling.kind == GLSLX.NodeKind.VARIABLES);
    return this._firstChild._nextSibling.isEmptySequence() ? null : this._firstChild._nextSibling;
  };

  GLSLX.Node.prototype.forUpdate = function() {
    assert(this.kind == GLSLX.NodeKind.FOR);
    assert(this.childCount() == 4);
    assert(GLSLX.in_NodeKind.isExpression(this._lastChild._previousSibling.kind));
    return this._lastChild._previousSibling.isEmptySequence() ? null : this._lastChild._previousSibling;
  };

  GLSLX.Node.prototype.forBody = function() {
    assert(this.kind == GLSLX.NodeKind.FOR);
    assert(this.childCount() == 4);
    assert(GLSLX.in_NodeKind.isStatement(this._lastChild.kind));
    return this._lastChild;
  };

  GLSLX.Node.prototype.ifTest = function() {
    assert(this.kind == GLSLX.NodeKind.IF);
    assert(this.childCount() == 2 || this.childCount() == 3);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.ifTrue = function() {
    assert(this.kind == GLSLX.NodeKind.IF);
    assert(this.childCount() == 2 || this.childCount() == 3);
    assert(GLSLX.in_NodeKind.isStatement(this._firstChild._nextSibling.kind));
    return this._firstChild._nextSibling;
  };

  GLSLX.Node.prototype.ifFalse = function() {
    assert(this.kind == GLSLX.NodeKind.IF);
    assert(this.childCount() == 2 || this.childCount() == 3);
    assert(this._firstChild._nextSibling._nextSibling == null || GLSLX.in_NodeKind.isStatement(this._firstChild._nextSibling._nextSibling.kind));
    return this._firstChild._nextSibling._nextSibling;
  };

  GLSLX.Node.prototype.returnValue = function() {
    assert(this.kind == GLSLX.NodeKind.RETURN);
    assert(this.childCount() <= 1);
    assert(this._firstChild == null || GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.variablesType = function() {
    assert(this.kind == GLSLX.NodeKind.VARIABLES);
    assert(this.childCount() >= 1);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.whileTest = function() {
    assert(this.kind == GLSLX.NodeKind.WHILE);
    assert(this.childCount() == 2);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.whileBody = function() {
    assert(this.kind == GLSLX.NodeKind.WHILE);
    assert(this.childCount() == 2);
    assert(GLSLX.in_NodeKind.isStatement(this._lastChild.kind));
    return this._lastChild;
  };

  GLSLX.Node.prototype.callTarget = function() {
    assert(this.kind == GLSLX.NodeKind.CALL);
    assert(this.childCount() >= 1);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.dotTarget = function() {
    assert(this.kind == GLSLX.NodeKind.DOT);
    assert(this.childCount() == 1);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.hookTest = function() {
    assert(this.kind == GLSLX.NodeKind.HOOK);
    assert(this.childCount() == 3);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.hookTrue = function() {
    assert(this.kind == GLSLX.NodeKind.HOOK);
    assert(this.childCount() == 3);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild._nextSibling.kind));
    return this._firstChild._nextSibling;
  };

  GLSLX.Node.prototype.hookFalse = function() {
    assert(this.kind == GLSLX.NodeKind.HOOK);
    assert(this.childCount() == 3);
    assert(GLSLX.in_NodeKind.isExpression(this._lastChild.kind));
    return this._lastChild;
  };

  GLSLX.Node.prototype.asString = function() {
    assert(this.kind == GLSLX.NodeKind.DOT);
    assert(this._text != null);
    return this._text;
  };

  GLSLX.Node.prototype.asBool = function() {
    assert(this.kind == GLSLX.NodeKind.BOOL);
    return !!this._literal;
  };

  GLSLX.Node.prototype.asFloat = function() {
    assert(this.kind == GLSLX.NodeKind.FLOAT);
    return this._literal;
  };

  GLSLX.Node.prototype.asInt = function() {
    assert(this.kind == GLSLX.NodeKind.INT);
    return this._literal | 0;
  };

  GLSLX.Node.prototype.unaryValue = function() {
    assert(GLSLX.in_NodeKind.isUnary(this.kind));
    assert(this.childCount() == 1);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.binaryLeft = function() {
    assert(GLSLX.in_NodeKind.isBinary(this.kind));
    assert(this.childCount() == 2);
    assert(GLSLX.in_NodeKind.isExpression(this._firstChild.kind));
    return this._firstChild;
  };

  GLSLX.Node.prototype.binaryRight = function() {
    assert(GLSLX.in_NodeKind.isBinary(this.kind));
    assert(this.childCount() == 2);
    assert(GLSLX.in_NodeKind.isExpression(this._lastChild.kind));
    return this._lastChild;
  };

  GLSLX.Node._createID = function() {
    GLSLX.Node._nextID = GLSLX.Node._nextID + 1 | 0;
    return GLSLX.Node._nextID;
  };

  GLSLX.Parser = {};

  GLSLX.Parser.typeParselet = function(type) {
    return function(context, token) {
      return new GLSLX.Node(GLSLX.NodeKind.TYPE).withType(type).withRange(token.range);
    };
  };

  GLSLX.Parser.unaryPrefix = function(kind) {
    assert(GLSLX.in_NodeKind.isUnaryPrefix(kind));
    return function(context, token, value) {
      return GLSLX.Node.createUnary(kind, value).withRange(GLSLX.Range.span(token.range, value.range)).withInternalRange(token.range);
    };
  };

  GLSLX.Parser.unaryPostfix = function(kind) {
    assert(GLSLX.in_NodeKind.isUnaryPostfix(kind));
    return function(context, value, token) {
      return GLSLX.Node.createUnary(kind, value).withRange(GLSLX.Range.span(value.range, token.range)).withInternalRange(token.range);
    };
  };

  GLSLX.Parser.binaryParselet = function(kind) {
    assert(GLSLX.in_NodeKind.isBinary(kind));
    return function(context, left, token, right) {
      return GLSLX.Node.createBinary(kind, left, right).withRange(GLSLX.Range.span(left.range, right.range)).withInternalRange(token.range);
    };
  };

  GLSLX.Parser.parseInt = function(text) {
    if (text.length > 1 && in_string.get1(text, 0) == 48 && (in_string.get1(text, 1) != 120 && in_string.get1(text, 1) != 88)) {
      return parseInt(text, 8);
    }

    return text | 0;
  };

  GLSLX.Parser.createExpressionParser = function() {
    var pratt = new GLSLX.Pratt();
    var invalidUnaryOperator = function(context, token, value) {
      context.log.syntaxErrorInvalidOperator(token.range);
      return new GLSLX.Node(GLSLX.NodeKind.UNKNOWN_CONSTANT).withType(GLSLX.Type.ERROR).withRange(GLSLX.Range.span(token.range, value.range));
    };
    var invalidBinaryOperator = function(context, left, token, right) {
      context.log.syntaxErrorInvalidOperator(token.range);
      return new GLSLX.Node(GLSLX.NodeKind.UNKNOWN_CONSTANT).withType(GLSLX.Type.ERROR).withRange(GLSLX.Range.span(left.range, right.range));
    };
    pratt.literal(GLSLX.TokenKind.TRUE, function(context, token) {
      return new GLSLX.Node(GLSLX.NodeKind.BOOL).withBool(true).withType(GLSLX.Type.BOOL).withRange(token.range);
    });
    pratt.literal(GLSLX.TokenKind.FALSE, function(context, token) {
      return new GLSLX.Node(GLSLX.NodeKind.BOOL).withBool(false).withType(GLSLX.Type.BOOL).withRange(token.range);
    });
    pratt.literal(GLSLX.TokenKind.INT_LITERAL, function(context, token) {
      return new GLSLX.Node(GLSLX.NodeKind.INT).withInt(GLSLX.Parser.parseInt(token.range.toString())).withType(GLSLX.Type.INT).withRange(token.range);
    });
    pratt.literal(GLSLX.TokenKind.FLOAT_LITERAL, function(context, token) {
      return new GLSLX.Node(GLSLX.NodeKind.FLOAT).withFloat(+token.range.toString()).withType(GLSLX.Type.FLOAT).withRange(token.range);
    });
    pratt.literal(GLSLX.TokenKind.BOOL, GLSLX.Parser.typeParselet(GLSLX.Type.BOOL));
    pratt.literal(GLSLX.TokenKind.BVEC2, GLSLX.Parser.typeParselet(GLSLX.Type.BVEC2));
    pratt.literal(GLSLX.TokenKind.BVEC3, GLSLX.Parser.typeParselet(GLSLX.Type.BVEC3));
    pratt.literal(GLSLX.TokenKind.BVEC4, GLSLX.Parser.typeParselet(GLSLX.Type.BVEC4));
    pratt.literal(GLSLX.TokenKind.FLOAT, GLSLX.Parser.typeParselet(GLSLX.Type.FLOAT));
    pratt.literal(GLSLX.TokenKind.INT, GLSLX.Parser.typeParselet(GLSLX.Type.INT));
    pratt.literal(GLSLX.TokenKind.IVEC2, GLSLX.Parser.typeParselet(GLSLX.Type.IVEC2));
    pratt.literal(GLSLX.TokenKind.IVEC3, GLSLX.Parser.typeParselet(GLSLX.Type.IVEC3));
    pratt.literal(GLSLX.TokenKind.IVEC4, GLSLX.Parser.typeParselet(GLSLX.Type.IVEC4));
    pratt.literal(GLSLX.TokenKind.MAT2, GLSLX.Parser.typeParselet(GLSLX.Type.MAT2));
    pratt.literal(GLSLX.TokenKind.MAT3, GLSLX.Parser.typeParselet(GLSLX.Type.MAT3));
    pratt.literal(GLSLX.TokenKind.MAT4, GLSLX.Parser.typeParselet(GLSLX.Type.MAT4));
    pratt.literal(GLSLX.TokenKind.VEC2, GLSLX.Parser.typeParselet(GLSLX.Type.VEC2));
    pratt.literal(GLSLX.TokenKind.VEC3, GLSLX.Parser.typeParselet(GLSLX.Type.VEC3));
    pratt.literal(GLSLX.TokenKind.VEC4, GLSLX.Parser.typeParselet(GLSLX.Type.VEC4));
    pratt.literal(GLSLX.TokenKind.VOID, GLSLX.Parser.typeParselet(GLSLX.Type.VOID));
    pratt.prefix(GLSLX.TokenKind.COMPLEMENT, GLSLX.Precedence.UNARY_PREFIX, invalidUnaryOperator);
    pratt.prefix(GLSLX.TokenKind.DECREMENT, GLSLX.Precedence.UNARY_PREFIX, GLSLX.Parser.unaryPrefix(GLSLX.NodeKind.PREFIX_DECREMENT));
    pratt.prefix(GLSLX.TokenKind.INCREMENT, GLSLX.Precedence.UNARY_PREFIX, GLSLX.Parser.unaryPrefix(GLSLX.NodeKind.PREFIX_INCREMENT));
    pratt.prefix(GLSLX.TokenKind.MINUS, GLSLX.Precedence.UNARY_PREFIX, GLSLX.Parser.unaryPrefix(GLSLX.NodeKind.NEGATIVE));
    pratt.prefix(GLSLX.TokenKind.NOT, GLSLX.Precedence.UNARY_PREFIX, GLSLX.Parser.unaryPrefix(GLSLX.NodeKind.NOT));
    pratt.prefix(GLSLX.TokenKind.PLUS, GLSLX.Precedence.UNARY_PREFIX, GLSLX.Parser.unaryPrefix(GLSLX.NodeKind.POSITIVE));
    pratt.postfix(GLSLX.TokenKind.DECREMENT, GLSLX.Precedence.UNARY_POSTFIX, GLSLX.Parser.unaryPostfix(GLSLX.NodeKind.POSTFIX_DECREMENT));
    pratt.postfix(GLSLX.TokenKind.INCREMENT, GLSLX.Precedence.UNARY_POSTFIX, GLSLX.Parser.unaryPostfix(GLSLX.NodeKind.POSTFIX_INCREMENT));
    pratt.infix(GLSLX.TokenKind.DIVIDE, GLSLX.Precedence.MULTIPLY, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.DIVIDE));
    pratt.infix(GLSLX.TokenKind.EQUAL, GLSLX.Precedence.COMPARE, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.EQUAL));
    pratt.infix(GLSLX.TokenKind.GREATER_THAN, GLSLX.Precedence.COMPARE, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.GREATER_THAN));
    pratt.infix(GLSLX.TokenKind.GREATER_THAN_OR_EQUAL, GLSLX.Precedence.COMPARE, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.GREATER_THAN_OR_EQUAL));
    pratt.infix(GLSLX.TokenKind.LESS_THAN, GLSLX.Precedence.COMPARE, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.LESS_THAN));
    pratt.infix(GLSLX.TokenKind.LESS_THAN_OR_EQUAL, GLSLX.Precedence.COMPARE, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.LESS_THAN_OR_EQUAL));
    pratt.infix(GLSLX.TokenKind.MINUS, GLSLX.Precedence.ADD, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.SUBTRACT));
    pratt.infix(GLSLX.TokenKind.MULTIPLY, GLSLX.Precedence.MULTIPLY, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.MULTIPLY));
    pratt.infix(GLSLX.TokenKind.NOT_EQUAL, GLSLX.Precedence.COMPARE, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.NOT_EQUAL));
    pratt.infix(GLSLX.TokenKind.PLUS, GLSLX.Precedence.ADD, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.ADD));
    pratt.infix(GLSLX.TokenKind.REMAINDER, GLSLX.Precedence.MULTIPLY, invalidBinaryOperator);
    pratt.infix(GLSLX.TokenKind.SHIFT_LEFT, GLSLX.Precedence.SHIFT, invalidBinaryOperator);
    pratt.infix(GLSLX.TokenKind.SHIFT_RIGHT, GLSLX.Precedence.SHIFT, invalidBinaryOperator);
    pratt.infix(GLSLX.TokenKind.LOGICAL_OR, GLSLX.Precedence.LOGICAL_OR, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.LOGICAL_OR));
    pratt.infix(GLSLX.TokenKind.LOGICAL_XOR, GLSLX.Precedence.LOGICAL_XOR, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.LOGICAL_XOR));
    pratt.infix(GLSLX.TokenKind.LOGICAL_AND, GLSLX.Precedence.LOGICAL_AND, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.LOGICAL_AND));
    pratt.infix(GLSLX.TokenKind.BITWISE_AND, GLSLX.Precedence.BITWISE_AND, invalidBinaryOperator);
    pratt.infix(GLSLX.TokenKind.BITWISE_OR, GLSLX.Precedence.BITWISE_OR, invalidBinaryOperator);
    pratt.infix(GLSLX.TokenKind.BITWISE_XOR, GLSLX.Precedence.BITWISE_XOR, invalidBinaryOperator);
    pratt.infixRight(GLSLX.TokenKind.ASSIGN, GLSLX.Precedence.ASSIGN, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.ASSIGN));
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_ADD, GLSLX.Precedence.ASSIGN, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.ASSIGN_ADD));
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_BITWISE_AND, GLSLX.Precedence.ASSIGN, invalidBinaryOperator);
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_BITWISE_OR, GLSLX.Precedence.ASSIGN, invalidBinaryOperator);
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_BITWISE_XOR, GLSLX.Precedence.ASSIGN, invalidBinaryOperator);
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_DIVIDE, GLSLX.Precedence.ASSIGN, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.ASSIGN_DIVIDE));
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_MULTIPLY, GLSLX.Precedence.ASSIGN, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.ASSIGN_MULTIPLY));
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_REMAINDER, GLSLX.Precedence.ASSIGN, invalidBinaryOperator);
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_SHIFT_LEFT, GLSLX.Precedence.ASSIGN, invalidBinaryOperator);
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_SHIFT_RIGHT, GLSLX.Precedence.ASSIGN, invalidBinaryOperator);
    pratt.infixRight(GLSLX.TokenKind.ASSIGN_SUBTRACT, GLSLX.Precedence.ASSIGN, GLSLX.Parser.binaryParselet(GLSLX.NodeKind.ASSIGN_SUBTRACT));

    // Name
    pratt.literal(GLSLX.TokenKind.IDENTIFIER, function(context, token) {
      var name = token.range.toString();
      var symbol = context.scope().find(name);

      if (symbol == null) {
        context.log.syntaxErrorBadSymbolReference(token.range);
        return new GLSLX.Node(GLSLX.NodeKind.PARSE_ERROR).withType(GLSLX.Type.ERROR).withRange(token.range);
      }

      // Check extension usage
      if (symbol.requiredExtension != null && context.compilationData.extensionBehavior(symbol.requiredExtension) == GLSLX.ExtensionBehavior.DISABLE) {
        context.log.syntaxErrorDisabledExtension(token.range, name, symbol.requiredExtension);
      }

      return (symbol.isStruct() ? new GLSLX.Node(GLSLX.NodeKind.TYPE).withType(symbol.resolvedType()) : new GLSLX.Node(GLSLX.NodeKind.NAME).withSymbol(symbol)).withRange(token.range);
    });

    // Sequence
    pratt.infix(GLSLX.TokenKind.COMMA, GLSLX.Precedence.COMMA, function(context, left, token, right) {
      if (left.kind != GLSLX.NodeKind.SEQUENCE) {
        left = new GLSLX.Node(GLSLX.NodeKind.SEQUENCE).appendChild(left).withRange(left.range);
      }

      left.appendChild(right);
      return left.withRange(context.spanSince(left.range));
    });

    // Dot
    pratt.parselet(GLSLX.TokenKind.DOT, GLSLX.Precedence.MEMBER).infix = function(context, left) {
      context.next();
      var name = context.current().range;

      if (!context.expect(GLSLX.TokenKind.IDENTIFIER)) {
        return null;
      }

      return GLSLX.Node.createDot(left, name.toString()).withRange(context.spanSince(left.range)).withInternalRange(name);
    };

    // Group
    pratt.parselet(GLSLX.TokenKind.LEFT_PARENTHESIS, GLSLX.Precedence.LOWEST).prefix = function(context) {
      var token = context.next();
      var value = pratt.parse(context, GLSLX.Precedence.LOWEST);

      if (value == null || !context.expect(GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
        return null;
      }

      return value.withRange(context.spanSince(token.range));
    };

    // Call
    pratt.parselet(GLSLX.TokenKind.LEFT_PARENTHESIS, GLSLX.Precedence.UNARY_POSTFIX).infix = function(context, left) {
      var token = context.next();
      var node = GLSLX.Node.createCall(left);

      if (!GLSLX.Parser.parseCommaSeparatedList(context, node, GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
        return null;
      }

      return node.withRange(context.spanSince(left.range)).withInternalRange(context.spanSince(token.range));
    };

    // Index
    pratt.parselet(GLSLX.TokenKind.LEFT_BRACKET, GLSLX.Precedence.MEMBER).infix = function(context, left) {
      var token = context.next();

      // The "[]" syntax isn't valid but skip over it and recover
      if (context.peek(GLSLX.TokenKind.RIGHT_BRACKET)) {
        context.unexpectedToken();
        context.next();
        return new GLSLX.Node(GLSLX.NodeKind.PARSE_ERROR).withType(GLSLX.Type.ERROR).withRange(context.spanSince(token.range));
      }

      var value = pratt.parse(context, GLSLX.Precedence.LOWEST);

      if (value == null || !context.expect(GLSLX.TokenKind.RIGHT_BRACKET)) {
        return null;
      }

      return GLSLX.Node.createBinary(GLSLX.NodeKind.INDEX, left, value).withRange(context.spanSince(left.range)).withInternalRange(context.spanSince(token.range));
    };

    // Hook
    pratt.parselet(GLSLX.TokenKind.QUESTION, GLSLX.Precedence.ASSIGN).infix = function(context, left) {
      context.next();
      var middle = pratt.parse(context, GLSLX.Precedence.COMMA);

      if (middle == null || !context.expect(GLSLX.TokenKind.COLON)) {
        return null;
      }

      var right = pratt.parse(context, GLSLX.Precedence.COMMA);

      if (right == null) {
        return null;
      }

      return GLSLX.Node.createHook(left, middle, right).withRange(context.spanSince(left.range));
    };
    return pratt;
  };

  GLSLX.Parser.parseCommaSeparatedList = function(context, parent, stop) {
    var isFirst = true;

    while (!context.eat(stop)) {
      if (!isFirst && !context.expect(GLSLX.TokenKind.COMMA)) {
        return false;
      }

      var value = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.COMMA);

      if (value == null) {
        return false;
      }

      parent.appendChild(value);
      isFirst = false;
    }

    return true;
  };

  GLSLX.Parser.parseDoWhile = function(context) {
    var token = context.next();
    context.pushScope(new GLSLX.Scope(GLSLX.ScopeKind.LOOP, context.scope()));
    var body = GLSLX.Parser.parseStatement(context, GLSLX.VariableKind.LOCAL);

    if (body == null || !context.expect(GLSLX.TokenKind.WHILE) || !context.expect(GLSLX.TokenKind.LEFT_PARENTHESIS)) {
      return null;
    }

    var test = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST);

    if (test == null) {
      return null;
    }

    if (!context.expect(GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
      return null;
    }

    context.popScope();
    return GLSLX.Parser.checkForSemicolon(context, token.range, GLSLX.Node.createDoWhile(body, test));
  };

  GLSLX.Parser.parseExportOrImport = function(context) {
    var token = context.next();
    var old = context.flags;
    context.flags |= token.kind == GLSLX.TokenKind.EXPORT ? GLSLX.SymbolFlags.EXPORTED : GLSLX.SymbolFlags.IMPORTED;

    // Parse a modifier block
    if (context.eat(GLSLX.TokenKind.LEFT_BRACE)) {
      var node = new GLSLX.Node(GLSLX.NodeKind.MODIFIER_BLOCK);

      if (!GLSLX.Parser.parseStatements(context, node, GLSLX.VariableKind.GLOBAL) || !context.expect(GLSLX.TokenKind.RIGHT_BRACE)) {
        return null;
      }

      context.flags = old;
      return node.withRange(context.spanSince(token.range));
    }

    // Just parse a single statement
    var statement = GLSLX.Parser.parseStatement(context, GLSLX.VariableKind.GLOBAL);

    if (statement == null) {
      return null;
    }

    context.flags = old;
    return statement;
  };

  GLSLX.Parser.parseExtension = function(context) {
    var token = context.next();
    var range = context.current().range;

    if (!context.expect(GLSLX.TokenKind.IDENTIFIER)) {
      return null;
    }

    var name = range.toString();

    // Parse an extension block (a non-standard addition)
    if (context.eat(GLSLX.TokenKind.LEFT_BRACE)) {
      if (!(name in context.compilationData.currentExtensions)) {
        // Silence warnings about this name
        context.compilationData.currentExtensions[name] = GLSLX.ExtensionBehavior.DEFAULT;
      }

      var block = new GLSLX.Node(GLSLX.NodeKind.MODIFIER_BLOCK);

      if (!GLSLX.Parser.parseStatements(context, block, GLSLX.VariableKind.GLOBAL) || !context.expect(GLSLX.TokenKind.RIGHT_BRACE)) {
        return null;
      }

      for (var child = block.firstChild(); child != null; child = child.nextSibling()) {
        if (child.kind == GLSLX.NodeKind.VARIABLES) {
          for (var variable = child.variablesType().nextSibling(); variable != null; variable = variable.nextSibling()) {
            variable.symbol.requiredExtension = name;
          }
        }

        else if (child.symbol != null) {
          child.symbol.requiredExtension = name;
        }
      }

      return block.withRange(context.spanSince(token.range));
    }

    // Warn about typos
    if (!(name in GLSLX.Parser._knownWebGLExtensions) && !(name in context.compilationData.currentExtensions)) {
      context.log.syntaxWarningUnknownExtension(range, name);
    }

    // Parse a regular extension pragma
    if (!context.expect(GLSLX.TokenKind.COLON)) {
      return null;
    }

    var text = context.current().range.toString();

    if (!(text in GLSLX.Parser._extensionBehaviors)) {
      context.unexpectedToken();
      return null;
    }

    context.next();

    // Activate or deactivate the extension
    var behavior = in_StringMap.get1(GLSLX.Parser._extensionBehaviors, text);
    context.compilationData.currentExtensions[name] = behavior;
    return new GLSLX.Node(GLSLX.NodeKind.EXTENSION).withText(name).withInt(behavior).withRange(context.spanSince(token.range)).withInternalRange(range);
  };

  GLSLX.Parser.parseFor = function(context) {
    var token = context.next();
    context.pushScope(new GLSLX.Scope(GLSLX.ScopeKind.LOOP, context.scope()));

    if (!context.expect(GLSLX.TokenKind.LEFT_PARENTHESIS)) {
      return null;
    }

    // Setup
    var setup = null;

    if (!context.eat(GLSLX.TokenKind.SEMICOLON)) {
      // Check for a type
      var flags = GLSLX.Parser.parseFlags(context, GLSLX.VariableKind.LOCAL);
      var type = null;

      if (flags != 0) {
        type = GLSLX.Parser.parseType(context, GLSLX.Parser.ParseTypeMode.REPORT_ERRORS);

        if (type == null) {
          return null;
        }
      }

      else {
        type = GLSLX.Parser.parseType(context, GLSLX.Parser.ParseTypeMode.IGNORE_ERRORS);
      }

      // Try to parse a variable
      if (type != null) {
        setup = GLSLX.Parser.parseAfterType(context, token.range, flags, type, GLSLX.Parser.Allow.AVOID_FUNCTIONS);

        if (setup == null) {
          return null;
        }
      }

      else {
        setup = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST);

        if (setup == null) {
          return null;
        }

        if (!context.expect(GLSLX.TokenKind.SEMICOLON)) {
          return null;
        }
      }
    }

    // Test
    var test = null;

    if (!context.eat(GLSLX.TokenKind.SEMICOLON)) {
      test = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST);

      if (test == null) {
        return null;
      }

      if (!context.expect(GLSLX.TokenKind.SEMICOLON)) {
        return null;
      }
    }

    // Update
    var update = null;

    if (!context.eat(GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
      update = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST);

      if (update == null) {
        return null;
      }

      if (!context.expect(GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
        return null;
      }
    }

    // Body
    var body = GLSLX.Parser.parseStatement(context, GLSLX.VariableKind.LOCAL);

    if (body == null) {
      return null;
    }

    context.popScope();
    return GLSLX.Node.createFor(setup, test, update, body).withRange(context.spanSince(token.range));
  };

  GLSLX.Parser.parseIf = function(context) {
    var token = context.next();

    if (!context.expect(GLSLX.TokenKind.LEFT_PARENTHESIS)) {
      return null;
    }

    var test = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST);

    if (test == null) {
      return null;
    }

    if (!context.expect(GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
      return null;
    }

    var yes = GLSLX.Parser.parseStatement(context, GLSLX.VariableKind.LOCAL);

    if (yes == null) {
      return null;
    }

    var no = null;

    if (context.eat(GLSLX.TokenKind.ELSE)) {
      no = GLSLX.Parser.parseStatement(context, GLSLX.VariableKind.LOCAL);

      if (no == null) {
        return null;
      }
    }

    return GLSLX.Node.createIf(test, yes, no).withRange(context.spanSince(token.range));
  };

  GLSLX.Parser.parseVersion = function(context) {
    var token = context.next();
    var range = context.current().range;

    if (!context.expect(GLSLX.TokenKind.INT_LITERAL)) {
      return null;
    }

    return new GLSLX.Node(GLSLX.NodeKind.VERSION).withInt(range.toString() | 0).withRange(context.spanSince(token.range));
  };

  GLSLX.Parser.parseWhile = function(context) {
    var token = context.next();
    context.pushScope(new GLSLX.Scope(GLSLX.ScopeKind.LOOP, context.scope()));

    if (!context.expect(GLSLX.TokenKind.LEFT_PARENTHESIS)) {
      return null;
    }

    var test = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST);

    if (test == null) {
      return null;
    }

    if (!context.expect(GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
      return null;
    }

    var body = GLSLX.Parser.parseStatement(context, GLSLX.VariableKind.LOCAL);

    if (body == null) {
      return null;
    }

    context.popScope();
    return GLSLX.Node.createWhile(test, body).withRange(context.spanSince(token.range));
  };

  GLSLX.Parser.parseReturn = function(context) {
    var token = context.next();
    var value = null;

    if (!context.eat(GLSLX.TokenKind.SEMICOLON)) {
      value = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST);

      if (value == null) {
        return null;
      }

      context.expect(GLSLX.TokenKind.SEMICOLON);
    }

    return GLSLX.Node.createReturn(value).withRange(context.spanSince(token.range));
  };

  GLSLX.Parser.parsePrecision = function(context) {
    var token = context.next();
    var flag = 0;

    switch (context.current().kind) {
      case GLSLX.TokenKind.LOWP: {
        flag = GLSLX.SymbolFlags.LOWP;
        break;
      }

      case GLSLX.TokenKind.MEDIUMP: {
        flag = GLSLX.SymbolFlags.MEDIUMP;
        break;
      }

      case GLSLX.TokenKind.HIGHP: {
        flag = GLSLX.SymbolFlags.HIGHP;
        break;
      }

      default: {
        context.unexpectedToken();
        return null;
      }
    }

    context.next();
    var type = GLSLX.Parser.parseType(context, GLSLX.Parser.ParseTypeMode.REPORT_ERRORS);

    if (type == null) {
      return null;
    }

    return GLSLX.Parser.checkForSemicolon(context, token.range, GLSLX.Node.createPrecision(flag, type));
  };

  GLSLX.Parser.parseStruct = function(context, flags) {
    var name = context.current().range;

    if (!context.expect(GLSLX.TokenKind.IDENTIFIER)) {
      return null;
    }

    var symbol = new GLSLX.StructSymbol(context.compilationData.nextSymbolID(), name, name.toString(), new GLSLX.Scope(GLSLX.ScopeKind.STRUCT, context.scope()));
    symbol.flags |= context.flags | flags;

    if (!GLSLX.Parser.tryToDefineUniquelyInScope(context, symbol)) {
      return null;
    }

    var range = context.current().range;
    var block = new GLSLX.Node(GLSLX.NodeKind.STRUCT_BLOCK);
    var variables = null;

    if (!context.expect(GLSLX.TokenKind.LEFT_BRACE)) {
      return null;
    }

    context.pushScope(symbol.scope);

    while (!context.peek(GLSLX.TokenKind.RIGHT_BRACE) && !context.peek(GLSLX.TokenKind.END_OF_FILE)) {
      var statement = GLSLX.Parser.parseStatement(context, GLSLX.VariableKind.STRUCT);

      if (statement == null) {
        return null;
      }

      if (statement.kind != GLSLX.NodeKind.VARIABLES) {
        context.log.syntaxErrorInsideStruct(statement.range);
        continue;
      }

      block.appendChild(statement);

      for (var child = statement.variablesType().nextSibling(); child != null; child = child.nextSibling()) {
        var variable = child.symbol.asVariable();
        symbol.variables.push(variable);

        if (variable.value != null) {
          context.log.syntaxErrorStructVariableInitializer(variable.value.range);
        }
      }
    }

    context.popScope();

    if (!context.expect(GLSLX.TokenKind.RIGHT_BRACE)) {
      return null;
    }

    block.withRange(context.spanSince(range));

    // Parse weird struct-variable hybrid things
    //
    //   struct S { int x; } y, z[2];
    //
    if (context.peek(GLSLX.TokenKind.IDENTIFIER)) {
      variables = GLSLX.Parser.parseVariables(0, new GLSLX.Node(GLSLX.NodeKind.TYPE).withType(symbol.resolvedType()), context.next().range, context);

      if (variables == null) {
        return null;
      }
    }

    else {
      context.expect(GLSLX.TokenKind.SEMICOLON);
    }

    return GLSLX.Node.createStruct(symbol, block, variables);
  };

  GLSLX.Parser.checkForLoopAndSemicolon = function(context, range, node) {
    var found = false;

    for (var scope = context.scope(); scope != null; scope = scope.parent) {
      if (scope.kind == GLSLX.ScopeKind.LOOP) {
        found = true;
        break;
      }
    }

    if (!found) {
      context.log.syntaxErrorOutsideLoop(range);
    }

    return GLSLX.Parser.checkForSemicolon(context, range, node);
  };

  GLSLX.Parser.checkForSemicolon = function(context, range, node) {
    context.expect(GLSLX.TokenKind.SEMICOLON);
    return node.withRange(context.spanSince(range));
  };

  GLSLX.Parser.parseAfterType = function(context, range, flags, type, allow) {
    var name = context.current().range;

    if (flags == 0 && !context.peek(GLSLX.TokenKind.IDENTIFIER)) {
      var value = GLSLX.Parser.pratt.resume(context, GLSLX.Precedence.LOWEST, type);

      if (value == null) {
        return null;
      }

      return GLSLX.Parser.checkForSemicolon(context, range, GLSLX.Node.createExpression(value));
    }

    if (!context.expect(GLSLX.TokenKind.IDENTIFIER)) {
      return null;
    }

    if (context.eat(GLSLX.TokenKind.LEFT_PARENTHESIS)) {
      return GLSLX.Parser.parseFunction(flags, type, name, context);
    }

    var variables = GLSLX.Parser.parseVariables(flags, type, name, context);

    if (variables == null) {
      return null;
    }

    return variables.withRange(context.spanSince(range));
  };

  GLSLX.Parser.parseStatement = function(context, mode) {
    var token = context.current();

    switch (token.kind) {
      case GLSLX.TokenKind.BREAK: {
        return GLSLX.Parser.checkForLoopAndSemicolon(context, context.next().range, new GLSLX.Node(GLSLX.NodeKind.BREAK));
      }

      case GLSLX.TokenKind.CONTINUE: {
        return GLSLX.Parser.checkForLoopAndSemicolon(context, context.next().range, new GLSLX.Node(GLSLX.NodeKind.CONTINUE));
      }

      case GLSLX.TokenKind.DISCARD: {
        return GLSLX.Parser.checkForSemicolon(context, context.next().range, new GLSLX.Node(GLSLX.NodeKind.DISCARD));
      }

      case GLSLX.TokenKind.DO: {
        return GLSLX.Parser.parseDoWhile(context);
      }

      case GLSLX.TokenKind.EXPORT:
      case GLSLX.TokenKind.IMPORT: {
        return GLSLX.Parser.parseExportOrImport(context);
      }

      case GLSLX.TokenKind.EXTENSION: {
        return GLSLX.Parser.parseExtension(context);
      }

      case GLSLX.TokenKind.FOR: {
        return GLSLX.Parser.parseFor(context);
      }

      case GLSLX.TokenKind.IF: {
        return GLSLX.Parser.parseIf(context);
      }

      case GLSLX.TokenKind.LEFT_BRACE: {
        return GLSLX.Parser.parseBlock(context);
      }

      case GLSLX.TokenKind.PRECISION: {
        return GLSLX.Parser.parsePrecision(context);
      }

      case GLSLX.TokenKind.RETURN: {
        return GLSLX.Parser.parseReturn(context);
      }

      case GLSLX.TokenKind.SEMICOLON: {
        return new GLSLX.Node(GLSLX.NodeKind.BLOCK).withRange(context.next().range);
      }

      case GLSLX.TokenKind.VERSION: {
        return GLSLX.Parser.parseVersion(context);
      }

      case GLSLX.TokenKind.WHILE: {
        return GLSLX.Parser.parseWhile(context);
      }
    }

    // Try to parse a variable or function
    var flags = GLSLX.Parser.parseFlags(context, mode);
    var type = null;

    if (context.eat(GLSLX.TokenKind.STRUCT)) {
      var struct = GLSLX.Parser.parseStruct(context, flags);

      if (struct == null) {
        return null;
      }

      return struct.withRange(context.spanSince(token.range));
    }

    if (flags != 0) {
      type = GLSLX.Parser.parseType(context, GLSLX.Parser.ParseTypeMode.REPORT_ERRORS);

      if (type == null) {
        return null;
      }
    }

    else {
      type = GLSLX.Parser.parseType(context, GLSLX.Parser.ParseTypeMode.IGNORE_ERRORS);
    }

    if (type != null) {
      return GLSLX.Parser.parseAfterType(context, token.range, flags, type, GLSLX.Parser.Allow.ALLOW_FUNCTIONS);
    }

    // Parse an expression
    var value = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST);

    if (value == null) {
      return null;
    }

    return GLSLX.Parser.checkForSemicolon(context, token.range, GLSLX.Node.createExpression(value));
  };

  GLSLX.Parser.checkStatementLocation = function(context, node) {
    if (node.kind == GLSLX.NodeKind.VARIABLES || node.kind == GLSLX.NodeKind.STRUCT) {
      return;
    }

    var isOutsideFunction = context.scope().kind == GLSLX.ScopeKind.GLOBAL || context.scope().kind == GLSLX.ScopeKind.STRUCT;
    var shouldBeOutsideFunction = node.kind == GLSLX.NodeKind.EXTENSION || node.kind == GLSLX.NodeKind.FUNCTION || node.kind == GLSLX.NodeKind.PRECISION || node.kind == GLSLX.NodeKind.VERSION;

    if (shouldBeOutsideFunction && !isOutsideFunction) {
      context.log.syntaxErrorInsideFunction(node.range);
    }

    else if (!shouldBeOutsideFunction && isOutsideFunction) {
      context.log.syntaxErrorOutsideFunction(node.range);
    }
  };

  GLSLX.Parser.parseInclude = function(context, parent) {
    // See if there is a string literal
    var range = context.current().range;

    if (!context.expect(GLSLX.TokenKind.STRING_LITERAL)) {
      return false;
    }

    // Decode the escapes
    var path = null;

    try {
      path = JSON.parse(range.toString());
    }

    catch (e) {
      context.log.syntaxErrorInvalidString(range);
      return false;
    }

    // Must have access to the file system
    var fileAccess = context.compilationData.fileAccess;

    if (fileAccess == null) {
      context.log.semanticErrorIncludeWithoutFileAccess(range);
      return false;
    }

    // Must be able to read the file
    var source = fileAccess(path, range.source.name);

    if (source == null) {
      context.log.semanticErrorIncludeBadPath(range, path);
      return false;
    }

    // Parse the file and insert it into the parent
    var tokens = GLSLX.Tokenizer.tokenize(context.log, source);
    var nestedContext = new GLSLX.ParserContext(context.log, tokens, context.compilationData, context.resolver);
    nestedContext.pushScope(context.scope());

    if (!GLSLX.Parser.parseStatements(nestedContext, parent, GLSLX.VariableKind.GLOBAL) || !nestedContext.expect(GLSLX.TokenKind.END_OF_FILE)) {
      return false;
    }

    return true;
  };

  GLSLX.Parser.parseBlock = function(context) {
    var token = context.current();
    var block = new GLSLX.Node(GLSLX.NodeKind.BLOCK);
    context.pushScope(new GLSLX.Scope(GLSLX.ScopeKind.LOCAL, context.scope()));

    if (!context.expect(GLSLX.TokenKind.LEFT_BRACE) || !GLSLX.Parser.parseStatements(context, block, GLSLX.VariableKind.LOCAL) || !context.expect(GLSLX.TokenKind.RIGHT_BRACE)) {
      return null;
    }

    context.popScope();
    return block.withRange(context.spanSince(token.range));
  };

  GLSLX.Parser.parseFlags = function(context, mode) {
    var flags = 0;

    while (true) {
      var kind = context.current().kind;

      switch (kind) {
        case GLSLX.TokenKind.ATTRIBUTE: {
          flags |= GLSLX.SymbolFlags.ATTRIBUTE;
          break;
        }

        case GLSLX.TokenKind.CONST: {
          flags |= GLSLX.SymbolFlags.CONST;
          break;
        }

        case GLSLX.TokenKind.HIGHP: {
          flags |= GLSLX.SymbolFlags.HIGHP;
          break;
        }

        case GLSLX.TokenKind.IN: {
          flags |= GLSLX.SymbolFlags.IN;
          break;
        }

        case GLSLX.TokenKind.INOUT: {
          flags |= GLSLX.SymbolFlags.INOUT;
          break;
        }

        case GLSLX.TokenKind.LOWP: {
          flags |= GLSLX.SymbolFlags.LOWP;
          break;
        }

        case GLSLX.TokenKind.MEDIUMP: {
          flags |= GLSLX.SymbolFlags.MEDIUMP;
          break;
        }

        case GLSLX.TokenKind.OUT: {
          flags |= GLSLX.SymbolFlags.OUT;
          break;
        }

        case GLSLX.TokenKind.UNIFORM: {
          flags |= GLSLX.SymbolFlags.UNIFORM;
          break;
        }

        case GLSLX.TokenKind.VARYING: {
          flags |= GLSLX.SymbolFlags.VARYING;
          break;
        }

        default: {
          return flags;
        }
      }

      if (mode == GLSLX.VariableKind.ARGUMENT && (kind == GLSLX.TokenKind.ATTRIBUTE || kind == GLSLX.TokenKind.UNIFORM || kind == GLSLX.TokenKind.VARYING) || mode == GLSLX.VariableKind.STRUCT && kind != GLSLX.TokenKind.LOWP && kind != GLSLX.TokenKind.MEDIUMP && kind != GLSLX.TokenKind.HIGHP || mode != GLSLX.VariableKind.ARGUMENT && (kind == GLSLX.TokenKind.IN || kind == GLSLX.TokenKind.OUT || kind == GLSLX.TokenKind.INOUT)) {
        context.log.syntaxErrorBadQualifier(context.current().range);
      }

      context.next();
    }
  };

  GLSLX.Parser.parseType = function(context, mode) {
    var token = context.current();
    var type = null;

    switch (token.kind) {
      case GLSLX.TokenKind.BOOL: {
        type = GLSLX.Type.BOOL;
        break;
      }

      case GLSLX.TokenKind.BVEC2: {
        type = GLSLX.Type.BVEC2;
        break;
      }

      case GLSLX.TokenKind.BVEC3: {
        type = GLSLX.Type.BVEC3;
        break;
      }

      case GLSLX.TokenKind.BVEC4: {
        type = GLSLX.Type.BVEC4;
        break;
      }

      case GLSLX.TokenKind.FLOAT: {
        type = GLSLX.Type.FLOAT;
        break;
      }

      case GLSLX.TokenKind.INT: {
        type = GLSLX.Type.INT;
        break;
      }

      case GLSLX.TokenKind.IVEC2: {
        type = GLSLX.Type.IVEC2;
        break;
      }

      case GLSLX.TokenKind.IVEC3: {
        type = GLSLX.Type.IVEC3;
        break;
      }

      case GLSLX.TokenKind.IVEC4: {
        type = GLSLX.Type.IVEC4;
        break;
      }

      case GLSLX.TokenKind.MAT2: {
        type = GLSLX.Type.MAT2;
        break;
      }

      case GLSLX.TokenKind.MAT3: {
        type = GLSLX.Type.MAT3;
        break;
      }

      case GLSLX.TokenKind.MAT4: {
        type = GLSLX.Type.MAT4;
        break;
      }

      case GLSLX.TokenKind.SAMPLER2D: {
        type = GLSLX.Type.SAMPLER2D;
        break;
      }

      case GLSLX.TokenKind.SAMPLERCUBE: {
        type = GLSLX.Type.SAMPLERCUBE;
        break;
      }

      case GLSLX.TokenKind.VEC2: {
        type = GLSLX.Type.VEC2;
        break;
      }

      case GLSLX.TokenKind.VEC3: {
        type = GLSLX.Type.VEC3;
        break;
      }

      case GLSLX.TokenKind.VEC4: {
        type = GLSLX.Type.VEC4;
        break;
      }

      case GLSLX.TokenKind.VOID: {
        type = GLSLX.Type.VOID;
        break;
      }

      case GLSLX.TokenKind.IDENTIFIER: {
        var symbol = context.scope().find(token.range.toString());

        if (symbol == null || !symbol.isStruct()) {
          if (mode == GLSLX.Parser.ParseTypeMode.REPORT_ERRORS) {
            context.unexpectedToken();
          }

          return null;
        }

        type = symbol.resolvedType();
        break;
      }

      default: {
        if (mode == GLSLX.Parser.ParseTypeMode.REPORT_ERRORS) {
          context.unexpectedToken();
        }

        return null;
      }
    }

    context.next();
    return new GLSLX.Node(GLSLX.NodeKind.TYPE).withType(type).withRange(context.spanSince(token.range));
  };

  GLSLX.Parser.parseFunction = function(flags, type, name, context) {
    var originalScope = context.scope();
    var $function = new GLSLX.FunctionSymbol(context.compilationData.nextSymbolID(), name, name.toString(), new GLSLX.Scope(GLSLX.ScopeKind.FUNCTION, originalScope));
    $function.flags |= context.flags | flags | ($function.name == 'main' ? GLSLX.SymbolFlags.EXPORTED : 0);
    $function.returnType = type;
    context.pushScope($function.scope);

    // Takes no arguments
    if (context.eat(GLSLX.TokenKind.VOID)) {
      if (!context.expect(GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
        return null;
      }
    }

    // Takes arguments
    else if (!context.eat(GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
      while (true) {
        // Parse leading flags
        var argumentFlags = GLSLX.Parser.parseFlags(context, GLSLX.VariableKind.ARGUMENT);

        // Parse the type
        var argumentType = GLSLX.Parser.parseType(context, GLSLX.Parser.ParseTypeMode.REPORT_ERRORS);

        if (argumentType == null) {
          return null;
        }

        // Parse the identifier
        var argumentName = context.current().range;

        if (!context.expect(GLSLX.TokenKind.IDENTIFIER)) {
          return null;
        }

        // Create the argument
        var argument = new GLSLX.VariableSymbol(context.compilationData.nextSymbolID(), argumentName, argumentName.toString(), context.scope(), GLSLX.VariableKind.ARGUMENT);
        argument.flags |= argumentFlags;
        argument.type = argumentType;
        $function.$arguments.push(argument);
        GLSLX.Parser.tryToDefineUniquelyInScope(context, argument);

        // Array size
        if (!GLSLX.Parser.parseArraySize(context, argument)) {
          return null;
        }

        // Parse another argument?
        if (!context.eat(GLSLX.TokenKind.COMMA)) {
          break;
        }
      }

      if (!context.expect(GLSLX.TokenKind.RIGHT_PARENTHESIS)) {
        return null;
      }
    }

    var previous = in_StringMap.get(originalScope.symbols, name.toString(), null);
    var hasBlock = !context.eat(GLSLX.TokenKind.SEMICOLON);

    // Merge adjacent function symbols to support overloading
    if (previous == null) {
      originalScope.define($function);
    }

    else if (previous.isFunction()) {
      for (var link = previous.asFunction(); link != null; link = link.previousOverload) {
        if (!link.hasSameArgumentTypesAs($function)) {
          continue;
        }

        // Overloading by return type is not allowed
        if (link.returnType.resolvedType != $function.returnType.resolvedType) {
          context.log.syntaxErrorDifferentReturnType($function.returnType.range, $function.name, $function.returnType.resolvedType, link.returnType.resolvedType, link.returnType.range);
        }

        // Defining a function more than once is not allowed
        else if (link.block != null || !hasBlock) {
          context.log.syntaxErrorDuplicateSymbolDefinition($function.range, link.range);
        }

        // Merge the function with its forward declaration
        else {
          assert(link.sibling == null);
          assert($function.sibling == null);
          link.sibling = $function;
          $function.sibling = link;
          $function.flags |= link.flags;
          link.flags = $function.flags;
        }

        break;
      }

      // Use a singly-linked list to store the function overloads
      $function.previousOverload = previous.asFunction();
      originalScope.redefine($function);
    }

    else {
      context.log.syntaxErrorDuplicateSymbolDefinition(name, previous.range);
      return null;
    }

    if (hasBlock) {
      var old = context.flags;
      context.flags &= ~(GLSLX.SymbolFlags.EXPORTED | GLSLX.SymbolFlags.IMPORTED);
      $function.block = GLSLX.Parser.parseBlock(context);
      context.flags &= old;

      if ($function.block == null) {
        return null;
      }
    }

    context.popScope();
    return new GLSLX.Node(GLSLX.NodeKind.FUNCTION).withSymbol($function).withRange(context.spanSince(type.range));
  };

  GLSLX.Parser.parseArraySize = function(context, variable) {
    var token = context.current();

    if (context.eat(GLSLX.TokenKind.LEFT_BRACKET)) {
      // The "[]" syntax isn't valid but skip over it and recover
      if (context.eat(GLSLX.TokenKind.RIGHT_BRACKET)) {
        context.log.syntaxErrorMissingArraySize(context.spanSince(token.range));
        return true;
      }

      variable.arrayCount = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST);

      if (variable.arrayCount == null || !context.expect(GLSLX.TokenKind.RIGHT_BRACKET)) {
        return false;
      }

      // The array size must be resolved immediately
      var count = 0;
      context.resolver.resolveNode(variable.arrayCount);
      context.resolver.checkConversion(variable.arrayCount, GLSLX.Type.INT);

      if (variable.arrayCount.resolvedType != GLSLX.Type.ERROR) {
        var folded = GLSLX.Folder.fold(variable.arrayCount);

        if (folded == null) {
          context.log.syntaxErrorConstantRequired(variable.arrayCount.range);
        }

        else if (folded.kind == GLSLX.NodeKind.INT) {
          var value = folded.asInt();

          if (value < 1) {
            context.log.syntaxErrorInvalidArraySize(variable.arrayCount.range, value);
          }

          else {
            count = value;
          }
        }
      }

      // Multidimensional arrays are not supported
      while (context.peek(GLSLX.TokenKind.LEFT_BRACKET)) {
        token = context.next();

        if (!context.peek(GLSLX.TokenKind.RIGHT_BRACKET) && GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.LOWEST) == null || !context.expect(GLSLX.TokenKind.RIGHT_BRACKET)) {
          return false;
        }

        context.log.syntaxErrorMultidimensionalArray(context.spanSince(token.range));
      }

      variable.type = new GLSLX.Node(GLSLX.NodeKind.TYPE).withType(variable.type.resolvedType.arrayType(count)).withRange(variable.type.range);
    }

    return true;
  };

  GLSLX.Parser.parseVariables = function(flags, type, name, context) {
    var variables = GLSLX.Node.createVariables(context.flags | flags, type);

    while (true) {
      var symbol = new GLSLX.VariableSymbol(context.compilationData.nextSymbolID(), name, name.toString(), context.scope(), context.scope().kind == GLSLX.ScopeKind.GLOBAL ? GLSLX.VariableKind.GLOBAL : context.scope().kind == GLSLX.ScopeKind.STRUCT ? GLSLX.VariableKind.STRUCT : GLSLX.VariableKind.LOCAL);
      symbol.flags |= context.flags | flags;
      symbol.type = type;

      // Array size
      if (!GLSLX.Parser.parseArraySize(context, symbol)) {
        return null;
      }

      // Initial value
      var assign = context.current().range;

      if (context.eat(GLSLX.TokenKind.ASSIGN)) {
        symbol.value = GLSLX.Parser.pratt.parse(context, GLSLX.Precedence.COMMA);

        if (symbol.value == null) {
          return null;
        }
      }

      else {
        assign = null;
      }

      // Constants must be resolved immediately
      var variable = new GLSLX.Node(GLSLX.NodeKind.VARIABLE).withSymbol(symbol).withRange(context.spanSince(symbol.range)).withInternalRange(assign);

      if (symbol.isConst()) {
        context.resolver.resolveNode(variable);
      }

      variables.appendChild(variable);
      GLSLX.Parser.tryToDefineUniquelyInScope(context, symbol);

      // Are there more variables in this statement?
      if (!context.eat(GLSLX.TokenKind.COMMA)) {
        context.expect(GLSLX.TokenKind.SEMICOLON);
        return variables;
      }

      name = context.current().range;

      if (!context.expect(GLSLX.TokenKind.IDENTIFIER)) {
        return null;
      }
    }
  };

  GLSLX.Parser.tryToDefineUniquelyInScope = function(context, symbol) {
    var previous = in_StringMap.get(context.scope().symbols, symbol.name, null);

    if (previous != null) {
      context.log.syntaxErrorDuplicateSymbolDefinition(symbol.range, previous.range);
      return false;
    }

    context.scope().define(symbol);
    return true;
  };

  GLSLX.Parser.parseStatements = function(context, parent, mode) {
    while (!context.peek(GLSLX.TokenKind.END_OF_FILE) && !context.peek(GLSLX.TokenKind.RIGHT_BRACE)) {
      if (context.eat(GLSLX.TokenKind.INCLUDE)) {
        if (!GLSLX.Parser.parseInclude(context, parent)) {
          return false;
        }

        continue;
      }

      var statement = GLSLX.Parser.parseStatement(context, mode);

      if (statement == null) {
        return false;
      }

      // Extension blocks are temporary and don't exist in the parsed result
      if (statement.kind == GLSLX.NodeKind.MODIFIER_BLOCK) {
        while (statement.hasChildren()) {
          var child = statement.firstChild().remove();
          GLSLX.Parser.checkStatementLocation(context, child);
          parent.appendChild(child);
        }
      }

      else {
        GLSLX.Parser.checkStatementLocation(context, statement);
        parent.appendChild(statement);
      }
    }

    return true;
  };

  GLSLX.Parser.parse = function(log, tokens, global, data, scope, resolver) {
    if (GLSLX.Parser.pratt == null) {
      GLSLX.Parser.pratt = GLSLX.Parser.createExpressionParser();
    }

    var context = new GLSLX.ParserContext(log, tokens, data, resolver);
    context.pushScope(scope);

    if (GLSLX.Parser.parseStatements(context, global, GLSLX.VariableKind.GLOBAL)) {
      context.expect(GLSLX.TokenKind.END_OF_FILE);
    }
  };

  GLSLX.Parser.Allow = {
    AVOID_FUNCTIONS: 0,
    ALLOW_FUNCTIONS: 1
  };

  GLSLX.Parser.ParseTypeMode = {
    IGNORE_ERRORS: 0,
    REPORT_ERRORS: 1
  };

  // The same operator precedence as C for the most part
  GLSLX.Precedence = {
    LOWEST: 0,
    COMMA: 1,
    ASSIGN: 2,
    LOGICAL_OR: 3,
    LOGICAL_XOR: 4,
    LOGICAL_AND: 5,
    BITWISE_OR: 6,
    BITWISE_XOR: 7,
    BITWISE_AND: 8,
    COMPARE: 10,
    SHIFT: 11,
    ADD: 12,
    MULTIPLY: 13,
    UNARY_PREFIX: 14,
    UNARY_POSTFIX: 15,
    MEMBER: 16
  };

  GLSLX.ParserContext = function(log, _tokens, compilationData, resolver) {
    this.log = log;
    this._tokens = _tokens;
    this.compilationData = compilationData;
    this.resolver = resolver;
    this.flags = 0;
    this._index = 0;
    this._scope = null;
  };

  GLSLX.ParserContext.prototype.current = function() {
    return in_List.get(this._tokens, this._index);
  };

  GLSLX.ParserContext.prototype.next = function() {
    var token = this.current();

    if ((this._index + 1 | 0) < this._tokens.length) {
      this._index = this._index + 1 | 0;
    }

    return token;
  };

  GLSLX.ParserContext.prototype.spanSince = function(range) {
    var previous = in_List.get(this._tokens, this._index > 0 ? this._index - 1 | 0 : 0);
    return previous.range.end < range.start ? range : GLSLX.Range.span(range, previous.range);
  };

  GLSLX.ParserContext.prototype.peek = function(kind) {
    return this.current().kind == kind;
  };

  GLSLX.ParserContext.prototype.eat = function(kind) {
    if (this.peek(kind)) {
      this.next();
      return true;
    }

    return false;
  };

  GLSLX.ParserContext.prototype.expect = function(kind) {
    if (this.eat(kind)) {
      return true;
    }

    var token = this.current();
    var range = token.range;
    var previous = (this._index > 0 ? in_List.get(this._tokens, this._index - 1 | 0) : token).range;

    // Put errors about missing semicolons and about tokens on the next line
    // after the previous token instead of at the next token
    if (kind == GLSLX.TokenKind.SEMICOLON || previous.lineColumn().line != range.lineColumn().line) {
      this.log.syntaxErrorExpectedToken1(previous.rangeAtEnd(), kind);
    }

    else {
      this.log.syntaxErrorExpectedToken2(range, token.kind, kind);
    }

    return false;
  };

  GLSLX.ParserContext.prototype.unexpectedToken = function() {
    this.log.syntaxErrorUnexpectedToken(this.current());
  };

  GLSLX.ParserContext.prototype.scope = function() {
    return this._scope;
  };

  GLSLX.ParserContext.prototype.pushScope = function(newScope) {
    assert(newScope.parent == this._scope);
    this._scope = newScope;
  };

  GLSLX.ParserContext.prototype.popScope = function() {
    assert(this._scope != null);
    this._scope = this._scope.parent;
  };

  GLSLX.Parselet = function(precedence) {
    this.precedence = precedence;
    this.prefix = null;
    this.infix = null;
  };

  // A Pratt parser is a parser that associates up to two operations per token,
  // each with its own precedence. Pratt parsers excel at parsing expression
  // trees with deeply nested precedence levels. For an excellent writeup, see:
  //
  //   http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/
  //
  GLSLX.Pratt = function() {
    this._table = {};
  };

  GLSLX.Pratt.prototype.parselet = function(kind, precedence) {
    var parselet = in_IntMap.get(this._table, kind, null);

    if (parselet == null) {
      var created = new GLSLX.Parselet(precedence);
      parselet = created;
      this._table[kind] = created;
    }

    else if (precedence > parselet.precedence) {
      parselet.precedence = precedence;
    }

    return parselet;
  };

  GLSLX.Pratt.prototype.parse = function(context, precedence) {
    var token = context.current();
    var parselet = in_IntMap.get(this._table, token.kind, null);

    if (parselet == null || parselet.prefix == null) {
      context.unexpectedToken();
      return null;
    }

    var node = this.resume(context, precedence, parselet.prefix(context));

    // Parselets must set the range of every node
    assert(node == null || node.range != null);
    return node;
  };

  GLSLX.Pratt.prototype.resume = function(context, precedence, left) {
    while (left != null) {
      var kind = context.current().kind;
      var parselet = in_IntMap.get(this._table, kind, null);

      if (parselet == null || parselet.infix == null || parselet.precedence <= precedence) {
        break;
      }

      left = parselet.infix(context, left);

      // Parselets must set the range of every node
      assert(left == null || left.range != null);
    }

    return left;
  };

  GLSLX.Pratt.prototype.literal = function(kind, callback) {
    this.parselet(kind, GLSLX.Precedence.LOWEST).prefix = function(context) {
      return callback(context, context.next());
    };
  };

  GLSLX.Pratt.prototype.prefix = function(kind, precedence, callback) {
    var self = this;
    self.parselet(kind, GLSLX.Precedence.LOWEST).prefix = function(context) {
      var token = context.next();
      var value = self.parse(context, precedence);
      return value != null ? callback(context, token, value) : null;
    };
  };

  GLSLX.Pratt.prototype.postfix = function(kind, precedence, callback) {
    this.parselet(kind, precedence).infix = function(context, left) {
      return callback(context, left, context.next());
    };
  };

  GLSLX.Pratt.prototype.infix = function(kind, precedence, callback) {
    var self = this;
    self.parselet(kind, precedence).infix = function(context, left) {
      var token = context.next();
      var right = self.parse(context, precedence);
      return right != null ? callback(context, left, token, right) : null;
    };
  };

  GLSLX.Pratt.prototype.infixRight = function(kind, precedence, callback) {
    var self = this;
    self.parselet(kind, precedence).infix = function(context, left) {
      var token = context.next();

      // Subtract 1 for right-associativity
      var right = self.parse(context, precedence - 1 | 0);
      return right != null ? callback(context, left, token, right) : null;
    };
  };

  GLSLX.Range = function(source, start, end) {
    this.source = source;
    this.start = start;
    this.end = end;
  };

  GLSLX.Range.prototype.toString = function() {
    return in_string.slice2(this.source.contents, this.start, this.end);
  };

  GLSLX.Range.prototype.slice = function(offsetStart, offsetEnd) {
    assert(offsetStart >= 0 && offsetStart <= offsetEnd && offsetEnd <= (this.end - this.start | 0));
    return new GLSLX.Range(this.source, this.start + offsetStart | 0, this.start + offsetEnd | 0);
  };

  GLSLX.Range.prototype.lineColumn = function() {
    return this.source.indexToLineColumn(this.start);
  };

  GLSLX.Range.prototype.rangeAtEnd = function() {
    return new GLSLX.Range(this.source, this.end, this.end);
  };

  GLSLX.Range.span = function(start, end) {
    assert(start.source == end.source);
    assert(start.start <= end.end);
    return new GLSLX.Range(start.source, start.start, end.end);
  };

  GLSLX.Resolver = function(_log, _data) {
    this._log = _log;
    this._data = _data;
    this._controlFlow = new GLSLX.ControlFlowAnalyzer();
    this._versions = [];
    this._generatedExtensions = Object.create(null);
    this._returnType = null;
  };

  GLSLX.Resolver.prototype.resolveGlobal = function(global) {
    this.resolveNode(global);

    // Remove all version statements
    for (var i = 0, list = this._versions, count = list.length; i < count; i = i + 1 | 0) {
      var version = in_List.get(list, i);
      version.remove();
    }

    // Re-insert the first version statement
    var first = global.firstChild();

    if (!(this._versions.length == 0)) {
      global.insertChildBefore(first, in_List.first(this._versions));
    }

    // Insert all automatically generated extensions
    for (var i1 = 0, list1 = in_StringMap.values(this._generatedExtensions), count1 = list1.length; i1 < count1; i1 = i1 + 1 | 0) {
      var extension = in_List.get(list1, i1);
      global.insertChildBefore(first, extension);
    }
  };

  GLSLX.Resolver.prototype.resolveNode = function(node) {
    if (node.resolvedType != null) {
      return;
    }

    node.resolvedType = GLSLX.Type.ERROR;
    var kind = node.kind;

    switch (kind) {
      case GLSLX.NodeKind.GLOBAL:
      case GLSLX.NodeKind.STRUCT_BLOCK: {
        this._resolveChildren(node);
        break;
      }

      case GLSLX.NodeKind.VARIABLE: {
        var symbol = node.symbol.asVariable();
        this.resolveNode(symbol.type);

        // Variables must have a type
        var type = symbol.type.resolvedType;

        if (type == GLSLX.Type.VOID) {
          this._log.semanticErrorBadVariableType(symbol.type.range, type);
          type = GLSLX.Type.ERROR;
        }

        // Array size
        if (symbol.arrayCount != null) {
          this._resolveAsExpression(symbol.arrayCount);
          this.checkConversion(symbol.arrayCount, GLSLX.Type.INT);
        }

        // Initial value
        if (symbol.value != null) {
          this._resolveAsExpression(symbol.value);
          this.checkConversion(symbol.value, type);

          if (type.containsArray) {
            this._log.semanticErrorArrayAssignment(node.internalRange, type);
          }
        }

        // Constants must be initialized
        if (symbol.isConst()) {
          if (symbol.value != null) {
            if (symbol.value.resolvedType != GLSLX.Type.ERROR) {
              var folded = GLSLX.Folder.fold(symbol.value);

              if (folded == null) {
                this._log.syntaxErrorConstantRequired(symbol.value.range);
              }

              else {
                assert(folded.parent() == null);
                assert(folded.resolvedType != null);
                symbol.constantValue = folded;
              }
            }
          }

          else if (symbol.kind == GLSLX.VariableKind.LOCAL) {
            this._log.semanticErrorUninitializedConstant(symbol.range);
          }
        }
        break;
      }

      case GLSLX.NodeKind.BLOCK: {
        this._resolveBlockOrStatement(node);
        break;
      }

      case GLSLX.NodeKind.BREAK:
      case GLSLX.NodeKind.CONTINUE:
      case GLSLX.NodeKind.DISCARD: {
        break;
      }

      case GLSLX.NodeKind.DO_WHILE: {
        this._resolveBlockOrStatement(node.doWhileBody());
        this.resolveNode(node.doWhileTest());
        this.checkConversion(node.doWhileTest(), GLSLX.Type.BOOL);
        break;
      }

      case GLSLX.NodeKind.EXPRESSION: {
        this.resolveNode(node.expressionValue());
        break;
      }

      case GLSLX.NodeKind.EXTENSION: {
        break;
      }

      case GLSLX.NodeKind.FOR: {
        if (node.forSetup() != null) {
          this._resolveAsExpression(node.forSetup());
        }

        if (node.forTest() != null) {
          this._resolveAsExpression(node.forTest());
          this.checkConversion(node.forTest(), GLSLX.Type.BOOL);
        }

        if (node.forUpdate() != null) {
          this._resolveAsExpression(node.forUpdate());
        }

        this._resolveBlockOrStatement(node.forBody());
        break;
      }

      case GLSLX.NodeKind.FUNCTION: {
        var symbol1 = node.symbol.asFunction();

        for (var i = 0, list = symbol1.$arguments, count = list.length; i < count; i = i + 1 | 0) {
          var argument = in_List.get(list, i);
          this.resolveNode(argument.type);
        }

        this.resolveNode(symbol1.returnType);

        if (symbol1.block != null) {
          this._returnType = symbol1.returnType.resolvedType;
          this._resolveBlockOrStatement(symbol1.block);

          // Missing a return statement is an error
          if (this._returnType != GLSLX.Type.VOID && symbol1.block.hasControlFlowAtEnd) {
            this._log.semanticErrorMissingReturn(symbol1.range, symbol1.name, this._returnType);
          }

          this._returnType = null;
        }
        break;
      }

      case GLSLX.NodeKind.IF: {
        this.resolveNode(node.ifTest());
        this.checkConversion(node.ifTest(), GLSLX.Type.BOOL);
        this._resolveBlockOrStatement(node.ifTrue());

        if (node.ifFalse() != null) {
          this._resolveBlockOrStatement(node.ifFalse());
        }
        break;
      }

      case GLSLX.NodeKind.PRECISION: {
        break;
      }

      case GLSLX.NodeKind.RETURN: {
        if (node.returnValue() != null) {
          this.resolveNode(node.returnValue());
          this.checkConversion(node.returnValue(), this._returnType != null ? this._returnType : GLSLX.Type.ERROR);
        }

        else {
          node.resolvedType = GLSLX.Type.VOID;
          this.checkConversion(node, this._returnType != null ? this._returnType : GLSLX.Type.ERROR);
        }
        break;
      }

      case GLSLX.NodeKind.STRUCT: {
        this._resolveChildren(node);

        // A struct loses operator "==" and "!=" when it contains a type without those operators
        var resolvedType = node.symbol.resolvedType();

        for (var i1 = 0, list1 = node.symbol.asStruct().variables, count1 = list1.length; i1 < count1; i1 = i1 + 1 | 0) {
          var variable = in_List.get(list1, i1);
          var type1 = variable.type.resolvedType;

          if (type1.containsArray) {
            resolvedType.containsArray = true;
          }

          if (type1.containsSampler) {
            resolvedType.containsSampler = true;
          }
        }
        break;
      }

      case GLSLX.NodeKind.VARIABLES: {
        this._resolveChildren(node);
        break;
      }

      case GLSLX.NodeKind.VERSION: {
        this._versions.push(node);
        break;
      }

      case GLSLX.NodeKind.WHILE: {
        this.resolveNode(node.whileTest());
        this.checkConversion(node.whileTest(), GLSLX.Type.BOOL);
        this._resolveBlockOrStatement(node.whileBody());
        break;
      }

      case GLSLX.NodeKind.CALL: {
        this._resolveCall(node);
        break;
      }

      case GLSLX.NodeKind.DOT: {
        this._resolveDot(node);
        break;
      }

      case GLSLX.NodeKind.HOOK: {
        var test = node.hookTest();
        var no = node.hookFalse();
        var yes = node.hookTrue();
        this._resolveAsExpression(test);
        this.checkConversion(test, GLSLX.Type.BOOL);
        this._resolveAsExpression(yes);
        this._resolveAsExpression(no);

        if (yes.resolvedType != no.resolvedType) {
          this._log.semanticErrorBadHookTypes(GLSLX.Range.span(yes.range, no.range), yes.resolvedType, no.resolvedType);
        }

        else if (yes.resolvedType.containsArray) {
          this._log.semanticErrorArrayHook(GLSLX.Range.span(yes.range, no.range), yes.resolvedType);
        }

        else {
          node.resolvedType = yes.resolvedType;
        }
        break;
      }

      case GLSLX.NodeKind.NAME: {
        var symbol2 = node.symbol;

        if (symbol2.isVariable()) {
          this.resolveNode(symbol2.asVariable().type);
          node.resolvedType = symbol2.asVariable().type.resolvedType;
        }

        else if (symbol2.isFunction() && !node.isCallTarget()) {
          this._log.semanticErrorMustCallFunction(node.range, symbol2.name);
        }

        else {
          node.resolvedType = symbol2.resolvedType();
        }

        // Make sure the extension is enabled if it hasn't been specified
        var name = symbol2.requiredExtension;

        if (name != null && !(name in this._generatedExtensions) && this._data.extensionBehavior(name) == GLSLX.ExtensionBehavior.DEFAULT) {
          this._generatedExtensions[name] = new GLSLX.Node(GLSLX.NodeKind.EXTENSION).withText(name).withInt(GLSLX.ExtensionBehavior.ENABLE);
        }
        break;
      }

      case GLSLX.NodeKind.SEQUENCE: {
        for (var child = node.firstChild(); child != null; child = child.nextSibling()) {
          this._resolveAsExpression(child);
        }

        node.resolvedType = node.lastChild().resolvedType;
        break;
      }

      default: {
        if (GLSLX.in_NodeKind.isUnary(kind)) {
          this._resolveUnary(node);
        }

        else if (GLSLX.in_NodeKind.isBinary(kind)) {
          this._resolveBinary(node);
        }

        else {
          assert(false);
        }
        break;
      }
    }

    assert(node.resolvedType != null);
  };

  GLSLX.Resolver.prototype._resolveBlockOrStatement = function(node) {
    assert(GLSLX.in_NodeKind.isStatement(node.kind));
    this._controlFlow.pushBlock(node);

    if (node.kind == GLSLX.NodeKind.BLOCK) {
      for (var child = node.firstChild(); child != null; child = child.nextSibling()) {
        this.resolveNode(child);
        this._controlFlow.visitStatement(child);
      }
    }

    else {
      this.resolveNode(node);
      this._controlFlow.visitStatement(node);
    }

    this._controlFlow.popBlock(node);
  };

  GLSLX.Resolver.prototype._resolveUnary = function(node) {
    var value = node.unaryValue();
    this._resolveAsExpression(value);

    if (GLSLX.in_NodeKind.isUnaryAssign(node.kind)) {
      this._checkStorage(value);
    }

    var valueType = value.resolvedType;

    switch (node.kind) {
      case GLSLX.NodeKind.NEGATIVE:
      case GLSLX.NodeKind.POSITIVE:
      case GLSLX.NodeKind.PREFIX_DECREMENT:
      case GLSLX.NodeKind.PREFIX_INCREMENT:
      case GLSLX.NodeKind.POSTFIX_DECREMENT:
      case GLSLX.NodeKind.POSTFIX_INCREMENT: {
        node.resolvedType = valueType.isIntOrFloat() ? valueType : GLSLX.Type.ERROR;
        break;
      }

      case GLSLX.NodeKind.NOT: {
        node.resolvedType = valueType == GLSLX.Type.BOOL ? GLSLX.Type.BOOL : GLSLX.Type.ERROR;
        break;
      }
    }

    if (node.resolvedType == GLSLX.Type.ERROR && valueType != GLSLX.Type.ERROR) {
      this._log.semanticErrorBadUnaryOperator(node.internalRange, node.internalRange.toString(), valueType);
    }
  };

  GLSLX.Resolver.prototype._resolveBinary = function(node) {
    var left = node.binaryLeft();
    var right = node.binaryRight();
    this._resolveAsExpression(left);
    this._resolveAsExpression(right);

    if (GLSLX.in_NodeKind.isBinaryAssign(node.kind)) {
      this._checkStorage(left);
    }

    var leftType = left.resolvedType;
    var rightType = right.resolvedType;
    var isSame = leftType == rightType;

    switch (node.kind) {
      case GLSLX.NodeKind.ADD:
      case GLSLX.NodeKind.SUBTRACT:
      case GLSLX.NodeKind.MULTIPLY:
      case GLSLX.NodeKind.DIVIDE: {
        node.resolvedType = isSame && leftType.componentType() != null ? leftType : leftType.hasFloatComponents() && rightType == GLSLX.Type.FLOAT ? leftType : leftType.hasIntComponents() && rightType == GLSLX.Type.INT ? leftType : leftType == GLSLX.Type.FLOAT && rightType.hasFloatComponents() ? rightType : leftType == GLSLX.Type.INT && rightType.hasIntComponents() ? rightType : node.kind == GLSLX.NodeKind.MULTIPLY && (leftType == GLSLX.Type.VEC2 && rightType == GLSLX.Type.MAT2 || leftType == GLSLX.Type.MAT2 && rightType == GLSLX.Type.VEC2) ? GLSLX.Type.VEC2 : node.kind == GLSLX.NodeKind.MULTIPLY && (leftType == GLSLX.Type.VEC3 && rightType == GLSLX.Type.MAT3 || leftType == GLSLX.Type.MAT3 && rightType == GLSLX.Type.VEC3) ? GLSLX.Type.VEC3 : node.kind == GLSLX.NodeKind.MULTIPLY && (leftType == GLSLX.Type.VEC4 && rightType == GLSLX.Type.MAT4 || leftType == GLSLX.Type.MAT4 && rightType == GLSLX.Type.VEC4) ? GLSLX.Type.VEC4 : GLSLX.Type.ERROR;
        break;
      }

      case GLSLX.NodeKind.EQUAL:
      case GLSLX.NodeKind.NOT_EQUAL: {
        node.resolvedType = isSame && leftType.canUseEqualityOperators() ? GLSLX.Type.BOOL : GLSLX.Type.ERROR;
        break;
      }

      case GLSLX.NodeKind.LOGICAL_AND:
      case GLSLX.NodeKind.LOGICAL_OR:
      case GLSLX.NodeKind.LOGICAL_XOR: {
        node.resolvedType = isSame && leftType == GLSLX.Type.BOOL ? GLSLX.Type.BOOL : GLSLX.Type.ERROR;
        break;
      }

      case GLSLX.NodeKind.LESS_THAN:
      case GLSLX.NodeKind.LESS_THAN_OR_EQUAL:
      case GLSLX.NodeKind.GREATER_THAN:
      case GLSLX.NodeKind.GREATER_THAN_OR_EQUAL: {
        node.resolvedType = isSame && (leftType == GLSLX.Type.FLOAT || leftType == GLSLX.Type.INT) ? GLSLX.Type.BOOL : GLSLX.Type.ERROR;
        break;
      }

      case GLSLX.NodeKind.ASSIGN: {
        node.resolvedType = leftType;

        if (leftType.containsArray) {
          this._log.semanticErrorArrayAssignment(node.internalRange, leftType);
        }

        this.checkConversion(right, leftType);
        return;
      }

      case GLSLX.NodeKind.ASSIGN_ADD:
      case GLSLX.NodeKind.ASSIGN_SUBTRACT:
      case GLSLX.NodeKind.ASSIGN_MULTIPLY:
      case GLSLX.NodeKind.ASSIGN_DIVIDE: {
        node.resolvedType = isSame && leftType.componentType() != null ? leftType : leftType.hasFloatComponents() && rightType == GLSLX.Type.FLOAT ? leftType : leftType.hasIntComponents() && rightType == GLSLX.Type.INT ? leftType : node.kind == GLSLX.NodeKind.ASSIGN_MULTIPLY && (leftType == GLSLX.Type.VEC2 && rightType == GLSLX.Type.MAT2 || leftType == GLSLX.Type.VEC3 && rightType == GLSLX.Type.MAT3 || leftType == GLSLX.Type.VEC4 && rightType == GLSLX.Type.MAT4) ? leftType : GLSLX.Type.ERROR;
        break;
      }

      case GLSLX.NodeKind.INDEX: {
        if (rightType == GLSLX.Type.INT) {
          var indexType = leftType.indexType();

          if (indexType != null) {
            node.resolvedType = indexType;
          }

          // Run bounds checking on the constant-folded value
          var folded = GLSLX.Folder.fold(right);

          if (folded != null && folded.kind == GLSLX.NodeKind.INT) {
            var value = folded.asInt();
            var count = leftType.indexCount();

            // Negative indices are always invalid even if the array size is unknown
            if (value < 0 || count != 0 && value >= count) {
              this._log.semanticErrorOutOfBoundsIndex(right.range, value, leftType);
            }
          }
        }
        break;
      }
    }

    // If we get here, show an error about an invalid operator
    if (node.resolvedType == GLSLX.Type.ERROR && leftType != GLSLX.Type.ERROR && rightType != GLSLX.Type.ERROR) {
      if (node.kind == GLSLX.NodeKind.INDEX) {
        this._log.semanticErrorBadIndex(node.internalRange, leftType, rightType);
      }

      else {
        this._log.semanticErrorBadBinaryOperator(node.internalRange, node.internalRange.toString(), leftType, rightType);
      }
    }
  };

  GLSLX.Resolver.prototype._resolveCall = function(node) {
    var callTarget = node.callTarget();
    this.resolveNode(callTarget);
    var type = callTarget.resolvedType;
    var symbol = type.symbol;
    var $arguments = [];
    var hasError = false;

    for (var child = callTarget.nextSibling(); child != null; child = child.nextSibling()) {
      this._resolveAsExpression(child);
      $arguments.push(child);

      if (child.resolvedType == GLSLX.Type.ERROR) {
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    if (symbol != null) {
      if (symbol.isFunction()) {
        this._resolveFunctionOverloads(symbol.asFunction(), node, $arguments);
        return;
      }

      if (symbol.isStruct()) {
        this._resolveConstructor(type, node, $arguments);
        return;
      }
    }

    if (type != GLSLX.Type.ERROR) {
      this._log.semanticErrorBadCall(callTarget.range, type);
    }
  };

  GLSLX.Resolver.prototype._resolveDot = function(node) {
    var dotTarget = node.dotTarget();
    var name = node.asString();
    var range = node.internalRange;
    this._resolveAsExpression(dotTarget);
    var type = dotTarget.resolvedType;
    var isAssignTarget = node.isAssignTarget();

    switch (type) {
      case GLSLX.Type.BVEC2:
      case GLSLX.Type.IVEC2:
      case GLSLX.Type.VEC2:
      case GLSLX.Type.BVEC3:
      case GLSLX.Type.IVEC3:
      case GLSLX.Type.VEC3:
      case GLSLX.Type.BVEC4:
      case GLSLX.Type.IVEC4:
      case GLSLX.Type.VEC4: {
        node.resolvedType = this._validateSwizzle(range, type, name, isAssignTarget);
        break;
      }

      default: {
        if (type.symbol != null && type.symbol.isStruct()) {
          for (var i = 0, list = type.symbol.asStruct().variables, count = list.length; i < count; i = i + 1 | 0) {
            var variable = in_List.get(list, i);

            if (variable.name == name) {
              node.symbol = variable;
              this.resolveNode(variable.type);
              node.resolvedType = variable.type.resolvedType;
              break;
            }
          }
        }

        if (node.symbol == null) {
          this._log.semanticErrorBadMember(range, type, name);
        }
        break;
      }
    }
  };

  GLSLX.Resolver.prototype._resolveFunctionOverloads = function(overloaded, node, $arguments) {
    var overloads = [];

    // Collect all relevant overloads but ignore forward-declared functions that also have an implementation
    for (var overload = overloaded; overload != null; overload = overload.previousOverload) {
      if (!(overloads.indexOf(overload.sibling) != -1)) {
        overloads.push(overload);
      }
    }

    // Narrow down by argument count
    if (overloads.length != 1) {
      overloads = overloads.slice();
      in_List.removeIf(overloads, function(overload) {
        return overload.$arguments.length != $arguments.length;
      });

      // Narrow down by argument types
      if (overloads.length != 1) {
        var overloadsBeforeTypeFilter = overloads.slice();
        in_List.removeIf(overloads, function(overload) {
          for (var i = 0, count = $arguments.length; i < count; i = i + 1 | 0) {
            if (in_List.get(overload.$arguments, i).type.resolvedType != in_List.get($arguments, i).resolvedType) {
              return true;
            }
          }

          return false;
        });

        // Narrow down by argument types with "conversions" to get better error messages
        if (overloads.length != 1) {
          overloads = overloadsBeforeTypeFilter;
          in_List.removeIf(overloads, function(overload) {
            for (var i = 0, count = $arguments.length; i < count; i = i + 1 | 0) {
              var from = in_List.get(overload.$arguments, i).type.resolvedType;
              var to = in_List.get($arguments, i).resolvedType;
              var fromSize = from.componentCount();
              var toSize = to.componentCount();

              if (from != to && (fromSize == 0 || toSize == 0 || fromSize != toSize)) {
                return true;
              }
            }

            return false;
          });
        }
      }
    }

    // Match failure
    if (overloads.length != 1) {
      this._log.semanticErrorBadOverloadMatch(node.callTarget().range, overloaded.name);
      return;
    }

    // Match success
    var overload1 = in_List.first(overloads);

    if (overload1.$arguments.length != $arguments.length) {
      this._log.semanticErrorArgumentCountFunction(node.internalRange, overload1.$arguments.length, $arguments.length, overload1.name, overload1.range);
    }

    else {
      for (var i = 0, count = $arguments.length; i < count; i = i + 1 | 0) {
        this.checkConversion(in_List.get($arguments, i), in_List.get(overload1.$arguments, i).type.resolvedType);
      }
    }

    node.callTarget().symbol = overload1;
    node.resolvedType = overload1.returnType.resolvedType;
  };

  GLSLX.Resolver.prototype._resolveConstructor = function(type, node, $arguments) {
    node.resolvedType = type;

    if (type == GLSLX.Type.ERROR) {
      return;
    }

    if (type.componentType() != null) {
      var count = type.componentCount();
      var hasMatrixArgument = false;

      // Visit each argument and make sure it's useful toward construction
      var providedCount = 0;

      for (var i1 = 0, list = $arguments, count1 = list.length; i1 < count1; i1 = i1 + 1 | 0) {
        var argument = in_List.get(list, i1);
        var argumentType = argument.resolvedType;
        var deltaCount = argumentType.componentCount();

        // Each type in a component-based types must be able to itself be unpacked into components
        if (argumentType.componentType() == null) {
          if (argumentType != GLSLX.Type.ERROR) {
            this._log.semanticErrorBadConstructorValue(argument.range, argumentType, type);
          }

          return;
        }

        // Passing extra values to a constructor is allowed sometimes
        //
        // Allowed:
        //
        //   vec3(vec4(1.0));
        //   vec3(1.0, vec4(1.0));
        //
        // Not allowed:
        //
        //   vec3(vec4(1.0), 1.0);
        //   vec3(vec3(1.0), vec3(1.0));
        //
        if (providedCount >= count) {
          this._log.semanticErrorExtraConstructorValue(argument.range, type, count, providedCount + deltaCount | 0);
        }

        if (argumentType.isMatrix()) {
          hasMatrixArgument = true;
        }

        providedCount = providedCount + deltaCount | 0;
      }

      // If a matrix argument is given to a matrix constructor, it is an error
      // to have any other arguments
      var isMatrixMatrixConstructor = type.isMatrix() && hasMatrixArgument;

      if (isMatrixMatrixConstructor && $arguments.length != 1) {
        this._log.semanticErrorBadMatrixConstructor(node.internalRange);
      }

      // Validate the count (constructing a matrix using a matrix should always work)
      else if (providedCount < count && providedCount != 1 && !isMatrixMatrixConstructor) {
        this._log.semanticErrorBadConstructorCount(node.internalRange, type, providedCount);
      }

      return;
    }

    var symbol = type.symbol.asStruct();
    var variables = symbol.variables;
    var variableCount = variables.length;
    var argumentCount = $arguments.length;

    // Validate argument count
    if (variableCount != argumentCount) {
      this._log.semanticErrorArgumentCountConstructor(node.internalRange, variableCount, argumentCount, symbol.name, symbol.range);
      return;
    }

    // Validate argument types
    for (var i = 0, count2 = variableCount; i < count2; i = i + 1 | 0) {
      this.checkConversion(in_List.get($arguments, i), in_List.get(variables, i).type.resolvedType);
    }
  };

  GLSLX.Resolver.prototype._validateSwizzle = function(range, type, name, isAssignTarget) {
    var count = name.length;

    if (count > 4) {
      this._log.semanticErrorBadSwizzle(range, type, name);
      return GLSLX.Type.ERROR;
    }

    var componentCount = type.componentCount();

    for (var i1 = 0, list = GLSLX.Swizzle.strings(componentCount), count2 = list.length; i1 < count2; i1 = i1 + 1 | 0) {
      var set = in_List.get(list, i1);

      if (set.indexOf(in_string.get(name, 0)) != -1) {
        for (var i = 1, count1 = count; i < count1; i = i + 1 | 0) {
          if (!(set.indexOf(in_string.get(name, i)) != -1)) {
            this._log.semanticErrorBadSwizzle(range, type, name);
            return GLSLX.Type.ERROR;
          }

          if (isAssignTarget && in_string.slice2(name, 0, i).indexOf(in_string.get(name, i)) != -1) {
            this._log.semanticErrorBadSwizzleAssignment(range.slice(i, i + 1 | 0), in_string.get(name, i));
            return GLSLX.Type.ERROR;
          }
        }

        return GLSLX.Swizzle.type(type.componentType(), count);
      }
    }

    this._log.semanticErrorBadSwizzle(range, type, name);
    return GLSLX.Type.ERROR;
  };

  GLSLX.Resolver.prototype._resolveAsExpression = function(node) {
    this.resolveNode(node);

    if (node.kind == GLSLX.NodeKind.TYPE && node.resolvedType != GLSLX.Type.ERROR) {
      this._log.semanticErrorUnexpectedType(node.range, node.resolvedType);
      node.resolvedType = GLSLX.Type.ERROR;
    }
  };

  GLSLX.Resolver.prototype._resolveChildren = function(node) {
    for (var child = node.firstChild(); child != null; child = child.nextSibling()) {
      this.resolveNode(child);
    }
  };

  GLSLX.Resolver.prototype._checkStorage = function(node) {
    var n = node;
    assert(GLSLX.in_NodeKind.isExpression(node.kind));

    label: while (true) {
      if (n.resolvedType == GLSLX.Type.ERROR) {
        break;
      }

      switch (n.kind) {
        case GLSLX.NodeKind.NAME: {
          if (n.symbol.isConst()) {
            this._log.semanticErrorBadStorage(node.range);
          }

          break label;
        }

        case GLSLX.NodeKind.DOT: {
          n = n.dotTarget();
          break;
        }

        case GLSLX.NodeKind.INDEX: {
          n = n.binaryLeft();
          break;
        }

        default: {
          this._log.semanticErrorBadStorage(node.range);
          break label;
        }
      }
    }
  };

  GLSLX.Resolver.prototype.checkConversion = function(node, type) {
    if (node.resolvedType != type && node.resolvedType != GLSLX.Type.ERROR && type != GLSLX.Type.ERROR) {
      this._log.semanticErrorBadConversion(node.range, node.resolvedType, type);
      node.resolvedType = GLSLX.Type.ERROR;
    }
  };

  GLSLX.ScopeKind = {
    FUNCTION: 0,
    GLOBAL: 1,
    LOCAL: 2,
    LOOP: 3,
    STRUCT: 4
  };

  GLSLX.Scope = function(kind, parent) {
    this.kind = kind;
    this.parent = parent;
    this.symbols = Object.create(null);
  };

  GLSLX.Scope.prototype.define = function(symbol) {
    assert(!(symbol.name in this.symbols));
    this.symbols[symbol.name] = symbol;
  };

  GLSLX.Scope.prototype.redefine = function(symbol) {
    assert(symbol.name in this.symbols);
    assert(in_StringMap.get1(this.symbols, symbol.name) != symbol);
    this.symbols[symbol.name] = symbol;
  };

  GLSLX.Scope.prototype.find = function(name) {
    var symbol = in_StringMap.get(this.symbols, name, null);

    if (symbol != null) {
      return symbol;
    }

    if (this.parent != null) {
      return this.parent.find(name);
    }

    return null;
  };

  GLSLX.LineColumn = function(line, column) {
    this.line = line;
    this.column = column;
  };

  GLSLX.Source = function(name, contents) {
    this.name = name;
    this.contents = contents;
    this.tokens = null;
    this._lineOffsets = null;
  };

  GLSLX.Source.prototype.indexToLineColumn = function(index) {
    this._computeLineOffsets();

    // Binary search to find the line
    var count = this._lineOffsets.length;
    var line = 0;

    while (count > 0) {
      var step = count / 2 | 0;
      var i = line + step | 0;

      if (in_List.get(this._lineOffsets, i) <= index) {
        line = i + 1 | 0;
        count = (count - step | 0) - 1 | 0;
      }

      else {
        count = step;
      }
    }

    // Use the line to compute the column
    var column = line > 0 ? index - in_List.get(this._lineOffsets, line - 1 | 0) | 0 : index;
    return new GLSLX.LineColumn(line - 1 | 0, column);
  };

  GLSLX.Source.prototype._computeLineOffsets = function() {
    if (this._lineOffsets == null) {
      this._lineOffsets = [0];

      for (var i = 0, count = this.contents.length; i < count; i = i + 1 | 0) {
        if (in_string.get1(this.contents, i) == 10) {
          this._lineOffsets.push(i + 1 | 0);
        }
      }
    }
  };

  GLSLX.Swizzle = {};

  GLSLX.Swizzle.strings = function(componentCount) {
    switch (componentCount) {
      case 2: {
        return GLSLX.Swizzle._STRINGS_2;
      }

      case 3: {
        return GLSLX.Swizzle._STRINGS_3;
      }

      case 4: {
        return GLSLX.Swizzle._STRINGS_4;
      }
    }

    assert(false);
    return null;
  };

  GLSLX.Swizzle.type = function(comonentType, componentCount) {
    switch (comonentType) {
      case GLSLX.Type.BOOL: {
        switch (componentCount) {
          case 1: {
            return GLSLX.Type.BOOL;
          }

          case 2: {
            return GLSLX.Type.BVEC2;
          }

          case 3: {
            return GLSLX.Type.BVEC3;
          }

          case 4: {
            return GLSLX.Type.BVEC4;
          }
        }
        break;
      }

      case GLSLX.Type.FLOAT: {
        switch (componentCount) {
          case 1: {
            return GLSLX.Type.FLOAT;
          }

          case 2: {
            return GLSLX.Type.VEC2;
          }

          case 3: {
            return GLSLX.Type.VEC3;
          }

          case 4: {
            return GLSLX.Type.VEC4;
          }
        }
        break;
      }

      case GLSLX.Type.INT: {
        switch (componentCount) {
          case 1: {
            return GLSLX.Type.INT;
          }

          case 2: {
            return GLSLX.Type.IVEC2;
          }

          case 3: {
            return GLSLX.Type.IVEC3;
          }

          case 4: {
            return GLSLX.Type.IVEC4;
          }
        }
        break;
      }
    }

    assert(false);
    return null;
  };

  GLSLX.SymbolFlags = {
    // Keyword modifiers
    ATTRIBUTE: 1,
    CONST: 2,
    HIGHP: 4,
    IN: 8,
    INOUT: 16,
    LOWP: 32,
    MEDIUMP: 64,
    OUT: 128,
    UNIFORM: 256,
    VARYING: 512,

    // Internal compiler flags
    EXPORTED: 1024,
    IMPORTED: 2048
  };

  GLSLX.Symbol = function(id, range, name, scope) {
    this.id = id;
    this.range = range;
    this.name = name;
    this.scope = scope;
    this.flags = 0;
    this.constantValue = null;
    this.requiredExtension = null;
    this._resolvedType = null;
  };

  GLSLX.Symbol.prototype.isConst = function() {
    return (GLSLX.SymbolFlags.CONST & this.flags) != 0;
  };

  GLSLX.Symbol.prototype.isStruct = function() {
    return this instanceof GLSLX.StructSymbol;
  };

  GLSLX.Symbol.prototype.isFunction = function() {
    return this instanceof GLSLX.FunctionSymbol;
  };

  GLSLX.Symbol.prototype.isVariable = function() {
    return this instanceof GLSLX.VariableSymbol;
  };

  GLSLX.Symbol.prototype.asStruct = function() {
    assert(this.isStruct());
    return this;
  };

  GLSLX.Symbol.prototype.asFunction = function() {
    assert(this.isFunction());
    return this;
  };

  GLSLX.Symbol.prototype.asVariable = function() {
    assert(this.isVariable());
    return this;
  };

  GLSLX.Symbol.prototype.resolvedType = function() {
    if (this._resolvedType == null) {
      this._resolvedType = new GLSLX.Type(this, null, 0);
    }

    return this._resolvedType;
  };

  GLSLX.StructSymbol = function(id, range, name, scope) {
    GLSLX.Symbol.call(this, id, range, name, scope);
    this.variables = [];
  };

  __extends(GLSLX.StructSymbol, GLSLX.Symbol);

  GLSLX.FunctionSymbol = function(id, range, name, scope) {
    GLSLX.Symbol.call(this, id, range, name, scope);
    this.$arguments = [];
    this.returnType = null;
    this.block = null;
    this.previousOverload = null;
    this.sibling = null;
  };

  __extends(GLSLX.FunctionSymbol, GLSLX.Symbol);

  GLSLX.FunctionSymbol.prototype.hasSameArgumentTypesAs = function($function) {
    if (this.$arguments.length != $function.$arguments.length) {
      return false;
    }

    for (var i = 0, count = this.$arguments.length; i < count; i = i + 1 | 0) {
      if (in_List.get(this.$arguments, i).type.resolvedType != in_List.get($function.$arguments, i).type.resolvedType) {
        return false;
      }
    }

    return true;
  };

  GLSLX.VariableKind = {
    ARGUMENT: 0,
    GLOBAL: 1,
    LOCAL: 2,
    STRUCT: 3
  };

  GLSLX.VariableSymbol = function(id, range, name, scope, kind) {
    GLSLX.Symbol.call(this, id, range, name, scope);
    this.kind = kind;
    this.type = null;
    this.value = null;
    this.arrayCount = null;
  };

  __extends(GLSLX.VariableSymbol, GLSLX.Symbol);

  GLSLX.TokenKind = {
    // Standard keywords
    ATTRIBUTE: 0,
    BOOL: 1,
    BREAK: 2,
    BVEC2: 3,
    BVEC3: 4,
    BVEC4: 5,
    CONST: 6,
    CONTINUE: 7,
    DISCARD: 8,
    DO: 9,
    ELSE: 10,
    FALSE: 11,
    FLOAT: 12,
    FOR: 13,
    HIGHP: 14,
    IF: 15,
    IN: 16,
    INOUT: 17,
    INT: 18,
    INVARIANT: 19,
    IVEC2: 20,
    IVEC3: 21,
    IVEC4: 22,
    LOWP: 23,
    MAT2: 24,
    MAT3: 25,
    MAT4: 26,
    MEDIUMP: 27,
    OUT: 28,
    PRECISION: 29,
    RETURN: 30,
    SAMPLER2D: 31,
    SAMPLERCUBE: 32,
    STRUCT: 33,
    TRUE: 34,
    UNIFORM: 35,
    VARYING: 36,
    VEC2: 37,
    VEC3: 38,
    VEC4: 39,
    VOID: 40,
    WHILE: 41,

    // Non-standard keywords
    EXPORT: 42,
    IMPORT: 43,

    // Unary
    COMPLEMENT: 44,
    DECREMENT: 45,
    INCREMENT: 46,
    NOT: 47,

    // Binary
    BITWISE_AND: 48,
    BITWISE_OR: 49,
    BITWISE_XOR: 50,
    DIVIDE: 51,
    EQUAL: 52,
    GREATER_THAN: 53,
    GREATER_THAN_OR_EQUAL: 54,
    LESS_THAN: 55,
    LESS_THAN_OR_EQUAL: 56,
    LOGICAL_AND: 57,
    LOGICAL_OR: 58,
    LOGICAL_XOR: 59,
    MINUS: 60,
    MULTIPLY: 61,
    NOT_EQUAL: 62,
    PLUS: 63,
    REMAINDER: 64,
    SHIFT_LEFT: 65,
    SHIFT_RIGHT: 66,

    // Binary assignment
    ASSIGN: 67,
    ASSIGN_ADD: 68,
    ASSIGN_BITWISE_AND: 69,
    ASSIGN_BITWISE_OR: 70,
    ASSIGN_BITWISE_XOR: 71,
    ASSIGN_DIVIDE: 72,
    ASSIGN_MULTIPLY: 73,
    ASSIGN_REMAINDER: 74,
    ASSIGN_SHIFT_LEFT: 75,
    ASSIGN_SHIFT_RIGHT: 76,
    ASSIGN_SUBTRACT: 77,

    // Other operators
    COLON: 78,
    COMMA: 79,
    DOT: 80,
    LEFT_BRACE: 81,
    LEFT_BRACKET: 82,
    LEFT_PARENTHESIS: 83,
    QUESTION: 84,
    RIGHT_BRACE: 85,
    RIGHT_BRACKET: 86,
    RIGHT_PARENTHESIS: 87,
    SEMICOLON: 88,

    // Pragmas
    EXTENSION: 89,
    VERSION: 90,
    INCLUDE: 91,

    // Literals
    FLOAT_LITERAL: 92,
    IDENTIFIER: 93,
    INT_LITERAL: 94,
    STRING_LITERAL: 95,

    // This is always at the end of the token stream
    END_OF_FILE: 96
  };

  GLSLX.Token = function(range, kind) {
    this.range = range;
    this.kind = kind;
  };

  GLSLX.Tokenizer = {};

  GLSLX.Tokenizer.tokenize = function(log, source) {
    var parts = source.contents.split(GLSLX.Tokenizer._tokenRegex);
    var tokens = [];
    var start = 0;

    for (var i = 0, count1 = parts.length; i < count1; i = i + 1 | 0) {
      var part = in_List.get(parts, i);
      var count = part.length;
      var end = start + count | 0;
      var range = new GLSLX.Range(source, start, end);

      if (i % 2 != 0) {
        var c = in_string.get1(part, 0);

        // Identifier
        if (c >= 65 && c <= 90 || c >= 97 && c <= 122 || c == 95) {
          var keyword = in_StringMap.get(GLSLX.Tokenizer.keywords, part, GLSLX.TokenKind.END_OF_FILE);

          if (keyword != GLSLX.TokenKind.END_OF_FILE) {
            tokens.push(new GLSLX.Token(range, keyword));
          }

          else if (part in GLSLX.Tokenizer.reservedWords) {
            log.syntaxErrorReservedWord(range);
          }

          else {
            tokens.push(new GLSLX.Token(range, GLSLX.TokenKind.IDENTIFIER));
          }
        }

        // Number
        else if (c >= 48 && c <= 57 || c == 46 && count > 1) {
          tokens.push(new GLSLX.Token(range, GLSLX.Tokenizer._intRegex.test(part) ? GLSLX.TokenKind.INT_LITERAL : GLSLX.TokenKind.FLOAT_LITERAL));
        }

        // Pragma
        else if (c == 35) {
          tokens.push(new GLSLX.Token(range, in_string.get1(part, 1) == 118 ? GLSLX.TokenKind.VERSION : in_string.get1(part, 1) == 101 ? GLSLX.TokenKind.EXTENSION : GLSLX.TokenKind.INCLUDE));
        }

        // String literal
        else if (c == 34) {
          tokens.push(new GLSLX.Token(range, GLSLX.TokenKind.STRING_LITERAL));
        }

        // Operator
        else {
          var kind = in_StringMap.get(GLSLX.Tokenizer.operators, part, GLSLX.TokenKind.END_OF_FILE);

          if (kind != GLSLX.TokenKind.END_OF_FILE) {
            tokens.push(new GLSLX.Token(range, kind));
          }
        }
      }

      else if (part != '') {
        log.syntaxErrorExtraData(range, part);
        break;
      }

      start = end;
    }

    tokens.push(new GLSLX.Token(new GLSLX.Range(source, start, start), GLSLX.TokenKind.END_OF_FILE));
    return tokens;
  };

  GLSLX.Type = function(symbol, isArrayOf, arrayCount) {
    this.symbol = symbol;
    this.isArrayOf = isArrayOf;
    this.arrayCount = arrayCount;
    this.containsArray = false;
    this.containsSampler = false;
    this._arrayTypes = null;
  };

  // A count of "0" means an array with an unknown size
  GLSLX.Type.prototype.arrayType = function(count) {
    assert(count >= 0);

    if (this._arrayTypes == null) {
      this._arrayTypes = {};
    }

    var arrayType = in_IntMap.get(this._arrayTypes, count, null);

    if (arrayType == null) {
      this._arrayTypes[count] = arrayType = new GLSLX.Type(null, this, count);
      arrayType.containsArray = true;
      arrayType.containsSampler = this.containsSampler;
    }

    return arrayType;
  };

  GLSLX.Type.prototype.toString = function() {
    if (this.isArrayOf != null) {
      return this.arrayCount != 0 ? this.isArrayOf.toString() + '[' + this.arrayCount.toString() + ']' : this.isArrayOf.toString() + '[]';
    }

    return this.symbol.name;
  };

  // For index expressions where "0 <= index < indexCount" (so indexCount == 0 means this type is un-indexable)
  GLSLX.Type.prototype.indexCount = function() {
    switch (this) {
      case GLSLX.Type.BVEC2:
      case GLSLX.Type.VEC2:
      case GLSLX.Type.IVEC2:
      case GLSLX.Type.MAT2: {
        return 2;
      }

      case GLSLX.Type.BVEC3:
      case GLSLX.Type.VEC3:
      case GLSLX.Type.IVEC3:
      case GLSLX.Type.MAT3: {
        return 3;
      }

      case GLSLX.Type.BVEC4:
      case GLSLX.Type.VEC4:
      case GLSLX.Type.IVEC4:
      case GLSLX.Type.MAT4: {
        return 4;
      }

      default: {
        return this.arrayCount;
      }
    }
  };

  // For index expressions
  GLSLX.Type.prototype.indexType = function() {
    switch (this) {
      case GLSLX.Type.BVEC2:
      case GLSLX.Type.BVEC3:
      case GLSLX.Type.BVEC4: {
        return GLSLX.Type.BOOL;
      }

      case GLSLX.Type.VEC2:
      case GLSLX.Type.VEC3:
      case GLSLX.Type.VEC4: {
        return GLSLX.Type.FLOAT;
      }

      case GLSLX.Type.IVEC2:
      case GLSLX.Type.IVEC3:
      case GLSLX.Type.IVEC4: {
        return GLSLX.Type.INT;
      }

      case GLSLX.Type.MAT2: {
        return GLSLX.Type.VEC2;
      }

      case GLSLX.Type.MAT3: {
        return GLSLX.Type.VEC3;
      }

      case GLSLX.Type.MAT4: {
        return GLSLX.Type.VEC4;
      }

      default: {
        return this.isArrayOf;
      }
    }
  };

  // For constructor expressions, returns the number of required elements
  GLSLX.Type.prototype.componentCount = function() {
    switch (this) {
      case GLSLX.Type.BOOL:
      case GLSLX.Type.FLOAT:
      case GLSLX.Type.INT: {
        return 1;
      }

      case GLSLX.Type.BVEC2:
      case GLSLX.Type.VEC2:
      case GLSLX.Type.IVEC2: {
        return 2;
      }

      case GLSLX.Type.BVEC3:
      case GLSLX.Type.VEC3:
      case GLSLX.Type.IVEC3: {
        return 3;
      }

      case GLSLX.Type.BVEC4:
      case GLSLX.Type.VEC4:
      case GLSLX.Type.IVEC4:
      case GLSLX.Type.MAT2: {
        return 4;
      }

      case GLSLX.Type.MAT3: {
        return 9;
      }

      case GLSLX.Type.MAT4: {
        return 16;
      }

      default: {
        return 0;
      }
    }
  };

  // For constructor expressions, returns the base element type corresponding to componentCount
  GLSLX.Type.prototype.componentType = function() {
    switch (this) {
      case GLSLX.Type.BOOL:
      case GLSLX.Type.BVEC2:
      case GLSLX.Type.BVEC3:
      case GLSLX.Type.BVEC4: {
        return GLSLX.Type.BOOL;
      }

      case GLSLX.Type.FLOAT:
      case GLSLX.Type.VEC2:
      case GLSLX.Type.VEC3:
      case GLSLX.Type.VEC4:
      case GLSLX.Type.MAT2:
      case GLSLX.Type.MAT3:
      case GLSLX.Type.MAT4: {
        return GLSLX.Type.FLOAT;
      }

      case GLSLX.Type.INT:
      case GLSLX.Type.IVEC2:
      case GLSLX.Type.IVEC3:
      case GLSLX.Type.IVEC4: {
        return GLSLX.Type.INT;
      }

      default: {
        return null;
      }
    }
  };

  // Vector types are the only ones with swizzles
  GLSLX.Type.prototype.isVector = function() {
    switch (this) {
      case GLSLX.Type.BVEC2:
      case GLSLX.Type.BVEC3:
      case GLSLX.Type.BVEC4:
      case GLSLX.Type.IVEC2:
      case GLSLX.Type.IVEC3:
      case GLSLX.Type.IVEC4:
      case GLSLX.Type.VEC2:
      case GLSLX.Type.VEC3:
      case GLSLX.Type.VEC4: {
        return true;
      }

      default: {
        return false;
      }
    }
  };

  GLSLX.Type.prototype.isMatrix = function() {
    switch (this) {
      case GLSLX.Type.MAT2:
      case GLSLX.Type.MAT3:
      case GLSLX.Type.MAT4: {
        return true;
      }

      default: {
        return false;
      }
    }
  };

  GLSLX.Type.prototype.hasIntComponents = function() {
    switch (this) {
      case GLSLX.Type.INT:
      case GLSLX.Type.IVEC2:
      case GLSLX.Type.IVEC3:
      case GLSLX.Type.IVEC4: {
        return true;
      }

      default: {
        return false;
      }
    }
  };

  GLSLX.Type.prototype.hasFloatComponents = function() {
    switch (this) {
      case GLSLX.Type.FLOAT:
      case GLSLX.Type.VEC2:
      case GLSLX.Type.VEC3:
      case GLSLX.Type.VEC4: {
        return true;
      }

      case GLSLX.Type.MAT2:
      case GLSLX.Type.MAT3:
      case GLSLX.Type.MAT4: {
        return true;
      }

      default: {
        return false;
      }
    }
  };

  GLSLX.Type.prototype.isIntOrFloat = function() {
    return this.hasIntComponents() || this.hasFloatComponents();
  };

  GLSLX.Type.prototype.canUseEqualityOperators = function() {
    return !this.containsSampler && !this.containsArray;
  };

  GLSLX.Type.prototype._setContainsSampler = function() {
    this.containsSampler = true;
    return this;
  };

  GLSLX.Exports = {};

  GLSLX.Exports.sourcesFromInput = function(input) {
    if (__isString(input)) {
      return [new GLSLX.Source('<stdin>', input)];
    }

    if (input instanceof Array) {
      var sources = [];

      for (var i = 0, count = input.length; i < count; i = i + 1 | 0) {
        sources.push(new GLSLX.Source(input[i].name, input[i].contents));
      }

      return sources;
    }

    return [new GLSLX.Source(input.name, input.contents)];
  };

  GLSLX.Exports.main = function() {
    var $this = (function() {
      return this;
    })();
    var root =  true ? exports : $this.GLSLX = {};

    // API exports
    root.check = GLSLX.Exports.check;
  };

  GLSLX.Exports.check = function(input, args) {
    args = args || {};
    var sources = GLSLX.Exports.sourcesFromInput(input);
    var log = new GLSLX.Log();
    var options = new GLSLX.CompilerOptions();

    if (args.disableRewriting) {
      options.compactSyntaxTree = false;
    }

    if (args.prettyPrint) {
      options.removeWhitespace = false;
    }

    if (args.keepSymbols) {
      options.trimSymbols = false;
    }

    if (args.globals) {
      options.globals = args.globals;
    }

    var result = GLSLX.Compiler.typeCheck(log, sources, options);
    return {'log': log, 'result': result};
  };

  GLSLX.in_NodeKind = {};

  GLSLX.in_NodeKind.isStatement = function(self) {
    return self >= GLSLX.NodeKind.BLOCK && self <= GLSLX.NodeKind.WHILE;
  };

  GLSLX.in_NodeKind.isExpression = function(self) {
    return self >= GLSLX.NodeKind.CALL && self <= GLSLX.NodeKind.ASSIGN_SUBTRACT;
  };

  GLSLX.in_NodeKind.isUnary = function(self) {
    return self >= GLSLX.NodeKind.NEGATIVE && self <= GLSLX.NodeKind.POSTFIX_INCREMENT;
  };

  GLSLX.in_NodeKind.isUnaryPrefix = function(self) {
    return self >= GLSLX.NodeKind.NEGATIVE && self <= GLSLX.NodeKind.PREFIX_INCREMENT;
  };

  GLSLX.in_NodeKind.isUnaryPostfix = function(self) {
    return self >= GLSLX.NodeKind.POSTFIX_DECREMENT && self <= GLSLX.NodeKind.POSTFIX_INCREMENT;
  };

  GLSLX.in_NodeKind.isUnaryAssign = function(self) {
    return self >= GLSLX.NodeKind.PREFIX_DECREMENT && self <= GLSLX.NodeKind.POSTFIX_INCREMENT;
  };

  GLSLX.in_NodeKind.isBinary = function(self) {
    return self >= GLSLX.NodeKind.ADD && self <= GLSLX.NodeKind.ASSIGN_SUBTRACT;
  };

  GLSLX.in_NodeKind.isBinaryAssign = function(self) {
    return self >= GLSLX.NodeKind.ASSIGN && self <= GLSLX.NodeKind.ASSIGN_SUBTRACT;
  };

  GLSLX.in_NodeKind.isLoop = function(self) {
    return self == GLSLX.NodeKind.DO_WHILE || self == GLSLX.NodeKind.FOR || self == GLSLX.NodeKind.WHILE;
  };

  GLSLX.in_TokenKind = {};
  var in_string = {};

  in_string.slice2 = function(self, start, end) {
    assert(0 <= start && start <= end && end <= self.length);
    return self.slice(start, end);
  };

  in_string.get1 = function(self, index) {
    assert(0 <= index && index < self.length);
    return self.charCodeAt(index);
  };

  in_string.get = function(self, index) {
    assert(0 <= index && index < self.length);
    return self[index];
  };

  var in_List = {};

  in_List.setLast = function(self, x) {
    return in_List.set(self, self.length - 1 | 0, x);
  };

  in_List.get = function(self, index) {
    assert(0 <= index && index < self.length);
    return self[index];
  };

  in_List.set = function(self, index, value) {
    assert(0 <= index && index < self.length);
    return self[index] = value;
  };

  in_List.first = function(self) {
    assert(!(self.length == 0));
    return in_List.get(self, 0);
  };

  in_List.last = function(self) {
    assert(!(self.length == 0));
    return in_List.get(self, self.length - 1 | 0);
  };

  in_List.removeLast = function(self) {
    assert(!(self.length == 0));
    self.pop();
  };

  in_List.takeLast = function(self) {
    assert(!(self.length == 0));
    return self.pop();
  };

  in_List.removeIf = function(self, callback) {
    var index = 0;

    // Remove elements in place
    for (var i = 0, count1 = self.length; i < count1; i = i + 1 | 0) {
      if (!callback(in_List.get(self, i))) {
        if (index < i) {
          in_List.set(self, index, in_List.get(self, i));
        }

        index = index + 1 | 0;
      }
    }

    // Shrink the array to the correct size
    while (index < self.length) {
      in_List.removeLast(self);
    }
  };

  var in_StringMap = {};

  in_StringMap.get1 = function(self, key) {
    assert(key in self);
    return self[key];
  };

  in_StringMap.insert = function(self, key, value) {
    self[key] = value;
    return self;
  };

  in_StringMap.get = function(self, key, defaultValue) {
    var value = self[key];

    // Compare against undefined so the key is only hashed once for speed
    return value !== void 0 ? value : defaultValue;
  };

  in_StringMap.values = function(self) {
    var values = [];

    for (var key in self) {
      values.push(in_StringMap.get1(self, key));
    }

    return values;
  };

  var in_IntMap = {};

  in_IntMap.get = function(self, key, defaultValue) {
    var value = self[key];

    // Compare against undefined so the key is only hashed once for speed
    return value !== void 0 ? value : defaultValue;
  };

  var RELEASE = false;

  // This is from https://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf
  GLSLX.API = '\nimport {\n  highp vec4 gl_Position; // should be written to\n  mediump float gl_PointSize; // may be written to\n\n  const int gl_MaxVertexAttribs;\n  const int gl_MaxVertexUniformVectors;\n  const int gl_MaxVaryingVectors;\n  const int gl_MaxVertexTextureImageUnits;\n  const int gl_MaxCombinedTextureImageUnits;\n  const int gl_MaxTextureImageUnits;\n  const int gl_MaxFragmentUniformVectors;\n  const int gl_MaxDrawBuffers;\n\n  const bool gl_FrontFacing;\n  const mediump vec2 gl_PointCoord;\n  const mediump vec4 gl_FragCoord;\n  mediump vec4 gl_FragColor;\n  mediump vec4 gl_FragData[gl_MaxDrawBuffers];\n\n  struct gl_DepthRangeParameters {\n    float near; // n\n    float far; // f\n    float diff; // f - n\n  };\n\n  uniform gl_DepthRangeParameters gl_DepthRange;\n\n  // Angle and Trigonometry Functions\n  float acos(float x);\n  float asin(float x);\n  float atan(float y, float x);\n  float atan(float y_over_x);\n  float cos(float angle);\n  float degrees(float radians);\n  float radians(float degrees);\n  float sin(float angle);\n  float tan(float angle);\n  vec2 acos(vec2 x);\n  vec2 asin(vec2 x);\n  vec2 atan(vec2 y, vec2 x);\n  vec2 atan(vec2 y_over_x);\n  vec2 cos(vec2 angle);\n  vec2 degrees(vec2 radians);\n  vec2 radians(vec2 degrees);\n  vec2 sin(vec2 angle);\n  vec2 tan(vec2 angle);\n  vec3 acos(vec3 x);\n  vec3 asin(vec3 x);\n  vec3 atan(vec3 y, vec3 x);\n  vec3 atan(vec3 y_over_x);\n  vec3 cos(vec3 angle);\n  vec3 degrees(vec3 radians);\n  vec3 radians(vec3 degrees);\n  vec3 sin(vec3 angle);\n  vec3 tan(vec3 angle);\n  vec4 acos(vec4 x);\n  vec4 asin(vec4 x);\n  vec4 atan(vec4 y, vec4 x);\n  vec4 atan(vec4 y_over_x);\n  vec4 cos(vec4 angle);\n  vec4 sin(vec4 angle);\n  vec4 tan(vec4 angle);\n\n  // Exponential Functions\n  float exp(float x);\n  float exp2(float x);\n  float inversesqrt(float x);\n  float log(float x);\n  float log2(float x);\n  float pow(float x, float y);\n  float sqrt(float x);\n  vec2 exp(vec2 x);\n  vec2 exp2(vec2 x);\n  vec2 inversesqrt(vec2 x);\n  vec2 log(vec2 x);\n  vec2 log2(vec2 x);\n  vec2 pow(vec2 x, vec2 y);\n  vec2 sqrt(vec2 x);\n  vec3 exp(vec3 x);\n  vec3 exp2(vec3 x);\n  vec3 inversesqrt(vec3 x);\n  vec3 log(vec3 x);\n  vec3 log2(vec3 x);\n  vec3 pow(vec3 x, vec3 y);\n  vec3 sqrt(vec3 x);\n  vec4 exp(vec4 x);\n  vec4 exp2(vec4 x);\n  vec4 inversesqrt(vec4 x);\n  vec4 log(vec4 x);\n  vec4 log2(vec4 x);\n  vec4 pow(vec4 x, vec4 y);\n  vec4 sqrt(vec4 x);\n\n  // Common Functions\n  float abs(float x);\n  float ceil(float x);\n  float clamp(float x, float minVal, float maxVal);\n  float floor(float x);\n  float fract(float x);\n  float max(float x, float y);\n  float min(float x, float y);\n  float mix(float x, float y, float a);\n  float mod(float x, float y);\n  float sign(float x);\n  float smoothstep(float edge0, float edge1, float x);\n  float step(float edge, float x);\n  vec2 abs(vec2 x);\n  vec2 ceil(vec2 x);\n  vec2 clamp(vec2 x, float minVal, float maxVal);\n  vec2 clamp(vec2 x, vec2 minVal, vec2 maxVal);\n  vec2 floor(vec2 x);\n  vec2 fract(vec2 x);\n  vec2 max(vec2 x, float y);\n  vec2 max(vec2 x, vec2 y);\n  vec2 min(vec2 x, float y);\n  vec2 min(vec2 x, vec2 y);\n  vec2 mix(vec2 x, vec2 y, float a);\n  vec2 mix(vec2 x, vec2 y, vec2 a);\n  vec2 mod(vec2 x, float y);\n  vec2 mod(vec2 x, vec2 y);\n  vec2 sign(vec2 x);\n  vec2 smoothstep(float edge0, float edge1, vec2 x);\n  vec2 smoothstep(vec2 edge0, vec2 edge1, vec2 x);\n  vec2 step(float edge, vec2 x);\n  vec2 step(vec2 edge, vec2 x);\n  vec3 abs(vec3 x);\n  vec3 ceil(vec3 x);\n  vec3 clamp(vec3 x, float minVal, float maxVal);\n  vec3 clamp(vec3 x, vec3 minVal, vec3 maxVal);\n  vec3 floor(vec3 x);\n  vec3 fract(vec3 x);\n  vec3 max(vec3 x, float y);\n  vec3 max(vec3 x, vec3 y);\n  vec3 min(vec3 x, float y);\n  vec3 min(vec3 x, vec3 y);\n  vec3 mix(vec3 x, vec3 y, float a);\n  vec3 mix(vec3 x, vec3 y, vec3 a);\n  vec3 mod(vec3 x, float y);\n  vec3 mod(vec3 x, vec3 y);\n  vec3 sign(vec3 x);\n  vec3 smoothstep(float edge0, float edge1, vec3 x);\n  vec3 smoothstep(vec3 edge0, vec3 edge1, vec3 x);\n  vec3 step(float edge, vec3 x);\n  vec3 step(vec3 edge, vec3 x);\n  vec4 abs(vec4 x);\n  vec4 ceil(vec4 x);\n  vec4 clamp(vec4 x, float minVal, float maxVal);\n  vec4 clamp(vec4 x, vec4 minVal, vec4 maxVal);\n  vec4 floor(vec4 x);\n  vec4 fract(vec4 x);\n  vec4 max(vec4 x, float y);\n  vec4 max(vec4 x, vec4 y);\n  vec4 min(vec4 x, float y);\n  vec4 min(vec4 x, vec4 y);\n  vec4 mix(vec4 x, vec4 y, float a);\n  vec4 mix(vec4 x, vec4 y, vec4 a);\n  vec4 mod(vec4 x, float y);\n  vec4 mod(vec4 x, vec4 y);\n  vec4 sign(vec4 x);\n  vec4 smoothstep(float edge0, float edge1, vec4 x);\n  vec4 smoothstep(vec4 edge0, vec4 edge1, vec4 x);\n  vec4 step(float edge, vec4 x);\n  vec4 step(vec4 edge, vec4 x);\n\n  // Geometric Functions\n  float distance(float p0, float p1);\n  float distance(vec2 p0, vec2 p1);\n  float distance(vec3 p0, vec3 p1);\n  float distance(vec4 p0, vec4 p1);\n  float dot(float x, float y);\n  float dot(vec2 x, vec2 y);\n  float dot(vec3 x, vec3 y);\n  float dot(vec4 x, vec4 y);\n  float faceforward(float N, float I, float Nref);\n  float length(float x);\n  float length(vec2 x);\n  float length(vec3 x);\n  float length(vec4 x);\n  float normalize(float x);\n  float reflect(float I, float N);\n  float refract(float I, float N, float eta);\n  vec2 faceforward(vec2 N, vec2 I, vec2 Nref);\n  vec2 normalize(vec2 x);\n  vec2 reflect(vec2 I, vec2 N);\n  vec2 refract(vec2 I, vec2 N, float eta);\n  vec3 cross(vec3 x, vec3 y);\n  vec3 faceforward(vec3 N, vec3 I, vec3 Nref);\n  vec3 normalize(vec3 x);\n  vec3 reflect(vec3 I, vec3 N);\n  vec3 refract(vec3 I, vec3 N, float eta);\n  vec4 faceforward(vec4 N, vec4 I, vec4 Nref);\n  vec4 normalize(vec4 x);\n  vec4 reflect(vec4 I, vec4 N);\n  vec4 refract(vec4 I, vec4 N, float eta);\n\n  // Matrix Functions\n  mat2 matrixCompMult(mat2 x, mat2 y);\n  mat3 matrixCompMult(mat3 x, mat3 y);\n  mat4 matrixCompMult(mat4 x, mat4 y);\n\n  // Vector Relational Functions\n  bool all(bvec2 x);\n  bool all(bvec3 x);\n  bool all(bvec4 x);\n  bool any(bvec2 x);\n  bool any(bvec3 x);\n  bool any(bvec4 x);\n  bvec2 equal(bvec2 x, bvec2 y);\n  bvec2 equal(ivec2 x, ivec2 y);\n  bvec2 equal(vec2 x, vec2 y);\n  bvec2 greaterThan(ivec2 x, ivec2 y);\n  bvec2 greaterThan(vec2 x, vec2 y);\n  bvec2 greaterThanEqual(ivec2 x, ivec2 y);\n  bvec2 greaterThanEqual(vec2 x, vec2 y);\n  bvec2 lessThan(ivec2 x, ivec2 y);\n  bvec2 lessThan(vec2 x, vec2 y);\n  bvec2 lessThanEqual(ivec2 x, ivec2 y);\n  bvec2 lessThanEqual(vec2 x, vec2 y);\n  bvec2 not(bvec2 x);\n  bvec2 notEqual(bvec2 x, bvec2 y);\n  bvec2 notEqual(ivec2 x, ivec2 y);\n  bvec2 notEqual(vec2 x, vec2 y);\n  bvec3 equal(bvec3 x, bvec3 y);\n  bvec3 equal(ivec3 x, ivec3 y);\n  bvec3 equal(vec3 x, vec3 y);\n  bvec3 greaterThan(ivec3 x, ivec3 y);\n  bvec3 greaterThan(vec3 x, vec3 y);\n  bvec3 greaterThanEqual(ivec3 x, ivec3 y);\n  bvec3 greaterThanEqual(vec3 x, vec3 y);\n  bvec3 lessThan(ivec3 x, ivec3 y);\n  bvec3 lessThan(vec3 x, vec3 y);\n  bvec3 lessThanEqual(ivec3 x, ivec3 y);\n  bvec3 lessThanEqual(vec3 x, vec3 y);\n  bvec3 not(bvec3 x);\n  bvec3 notEqual(bvec3 x, bvec3 y);\n  bvec3 notEqual(ivec3 x, ivec3 y);\n  bvec3 notEqual(vec3 x, vec3 y);\n  bvec4 equal(bvec4 x, bvec4 y);\n  bvec4 equal(ivec4 x, ivec4 y);\n  bvec4 equal(vec4 x, vec4 y);\n  bvec4 greaterThan(ivec4 x, ivec4 y);\n  bvec4 greaterThan(vec4 x, vec4 y);\n  bvec4 greaterThanEqual(ivec4 x, ivec4 y);\n  bvec4 greaterThanEqual(vec4 x, vec4 y);\n  bvec4 lessThan(ivec4 x, ivec4 y);\n  bvec4 lessThan(vec4 x, vec4 y);\n  bvec4 lessThanEqual(ivec4 x, ivec4 y);\n  bvec4 lessThanEqual(vec4 x, vec4 y);\n  bvec4 not(bvec4 x);\n  bvec4 notEqual(bvec4 x, bvec4 y);\n  bvec4 notEqual(ivec4 x, ivec4 y);\n  bvec4 notEqual(vec4 x, vec4 y);\n\n  // Texture Lookup Functions\n  vec4 texture2D(sampler2D sampler, vec2 coord);\n  vec4 texture2D(sampler2D sampler, vec2 coord, float bias);\n  vec4 texture2DLod(sampler2D sampler, vec2 coord, float lod);\n  vec4 texture2DProj(sampler2D sampler, vec3 coord);\n  vec4 texture2DProj(sampler2D sampler, vec3 coord, float bias);\n  vec4 texture2DProj(sampler2D sampler, vec4 coord);\n  vec4 texture2DProj(sampler2D sampler, vec4 coord, float bias);\n  vec4 texture2DProjLod(sampler2D sampler, vec3 coord, float lod);\n  vec4 texture2DProjLod(sampler2D sampler, vec4 coord, float lod);\n  vec4 textureCube(samplerCube sampler, vec3 coord);\n  vec4 textureCube(samplerCube sampler, vec3 coord, float bias);\n  vec4 textureCubeLod(samplerCube sampler, vec3 coord, float lod);\n\n  #extension GL_OES_standard_derivatives {\n    float dFdx(float v);\n    float dFdy(float v);\n    float fwidth(float v);\n    vec2 dFdx(vec2 v);\n    vec2 dFdy(vec2 v);\n    vec2 fwidth(vec2 v);\n    vec3 dFdx(vec3 v);\n    vec3 dFdy(vec3 v);\n    vec3 fwidth(vec3 v);\n    vec4 dFdx(vec4 v);\n    vec4 dFdy(vec4 v);\n    vec4 fwidth(vec4 v);\n  }\n\n  #extension GL_EXT_frag_depth {\n    float gl_FragDepthEXT;\n  }\n\n  #extension GL_EXT_shader_texture_lod {\n    vec4 texture2DGradEXT(sampler2D sampler, vec2 P, vec2 dPdx, vec2 dPdy);\n    vec4 texture2DLodEXT(sampler2D sampler, vec2 coord, float lod);\n    vec4 texture2DProjGradEXT(sampler2D sampler, vec3 P, vec2 dPdx, vec2 dPdy);\n    vec4 texture2DProjGradEXT(sampler2D sampler, vec4 P, vec2 dPdx, vec2 dPdy);\n    vec4 texture2DProjLodEXT(sampler2D sampler, vec3 coord, float lod);\n    vec4 texture2DProjLodEXT(sampler2D sampler, vec4 coord, float lod);\n    vec4 textureCubeGradEXT(samplerCube sampler, vec3 P, vec3 dPdx, vec3 dPdy);\n    vec4 textureCubeLodEXT(samplerCube sampler, vec3 coord, float lod);\n  }\n}\n';
  GLSLX.Node._nextID = 0;
  GLSLX.Parser.pratt = null;
  GLSLX.Parser._extensionBehaviors = in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(Object.create(null), 'disable', GLSLX.ExtensionBehavior.DISABLE), 'enable', GLSLX.ExtensionBehavior.ENABLE), 'require', GLSLX.ExtensionBehavior.REQUIRE), 'warn', GLSLX.ExtensionBehavior.WARN);

  // From https://www.khronos.org/registry/webgl/extensions/
  GLSLX.Parser._knownWebGLExtensions = in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(Object.create(null), 'GL_OES_standard_derivatives', 0), 'GL_EXT_frag_depth', 0), 'GL_EXT_draw_buffers', 0), 'GL_EXT_shader_texture_lod', 0);
  GLSLX.Swizzle._STRINGS_2 = ['xy', 'st', 'rg'];
  GLSLX.Swizzle._STRINGS_3 = ['xyz', 'stp', 'rgb'];
  GLSLX.Swizzle._STRINGS_4 = ['xyzw', 'stpq', 'rgba'];

  // The order matters here due to greedy matching
  GLSLX.Tokenizer._tokenRegex = new RegExp('(' + '\\.[0-9]+[eE][+-]?[0-9]+\\b|' + '\\.[0-9]+\\b|' + '[0-9]+\\.[0-9]+[eE][+-]?[0-9]+\\b|' + '[0-9]+\\.[0-9]+\\b|' + '[0-9]+\\.[eE][+-]?[0-9]+\\b|' + '[0-9]+\\.|' + '[0-9]+[eE][+-]?[0-9]+\\b|' + '[1-9][0-9]*\\b|' + '0[0-7]*\\b|' + '0[xX][0-9A-Fa-f]+\\b|' + '[ \t\r\n]|' + '/\\*(?:.|\r\n|\n)*?\\*/|' + '//.*|' + '&&|\\|\\||\\^\\^|\\+\\+|--|<<=?|>>=?|[()[\\]{}\\.,?:;]|[+\\-*/%=!<>&|^~]=?|' + '[A-Za-z_][A-Za-z0-9_]*\\b|' + '#(?:version|extension|include)\\b|' + '"(?:[^"\\\\]|\\\\.)*"' + ')');
  GLSLX.Tokenizer._intRegex = new RegExp('^(' + '[1-9][0-9]*|' + '0[0-7]*|' + '0[xX][0-9A-Fa-f]+' + ')$');
  GLSLX.Tokenizer.keywords = in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(Object.create(null), 'attribute', GLSLX.TokenKind.ATTRIBUTE), 'bool', GLSLX.TokenKind.BOOL), 'break', GLSLX.TokenKind.BREAK), 'bvec2', GLSLX.TokenKind.BVEC2), 'bvec3', GLSLX.TokenKind.BVEC3), 'bvec4', GLSLX.TokenKind.BVEC4), 'const', GLSLX.TokenKind.CONST), 'continue', GLSLX.TokenKind.CONTINUE), 'discard', GLSLX.TokenKind.DISCARD), 'do', GLSLX.TokenKind.DO), 'else', GLSLX.TokenKind.ELSE), 'false', GLSLX.TokenKind.FALSE), 'float', GLSLX.TokenKind.FLOAT), 'for', GLSLX.TokenKind.FOR), 'highp', GLSLX.TokenKind.HIGHP), 'if', GLSLX.TokenKind.IF), 'in', GLSLX.TokenKind.IN), 'inout', GLSLX.TokenKind.INOUT), 'int', GLSLX.TokenKind.INT), 'invariant', GLSLX.TokenKind.INVARIANT), 'ivec2', GLSLX.TokenKind.IVEC2), 'ivec3', GLSLX.TokenKind.IVEC3), 'ivec4', GLSLX.TokenKind.IVEC4), 'lowp', GLSLX.TokenKind.LOWP), 'mat2', GLSLX.TokenKind.MAT2), 'mat3', GLSLX.TokenKind.MAT3), 'mat4', GLSLX.TokenKind.MAT4), 'mediump', GLSLX.TokenKind.MEDIUMP), 'out', GLSLX.TokenKind.OUT), 'precision', GLSLX.TokenKind.PRECISION), 'return', GLSLX.TokenKind.RETURN), 'sampler2D', GLSLX.TokenKind.SAMPLER2D), 'samplerCube', GLSLX.TokenKind.SAMPLERCUBE), 'struct', GLSLX.TokenKind.STRUCT), 'true', GLSLX.TokenKind.TRUE), 'uniform', GLSLX.TokenKind.UNIFORM), 'varying', GLSLX.TokenKind.VARYING), 'vec2', GLSLX.TokenKind.VEC2), 'vec3', GLSLX.TokenKind.VEC3), 'vec4', GLSLX.TokenKind.VEC4), 'void', GLSLX.TokenKind.VOID), 'while', GLSLX.TokenKind.WHILE), 'export', GLSLX.TokenKind.EXPORT), 'import', GLSLX.TokenKind.IMPORT);
  GLSLX.Tokenizer.operators = in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(Object.create(null), '~', GLSLX.TokenKind.COMPLEMENT), '--', GLSLX.TokenKind.DECREMENT), '++', GLSLX.TokenKind.INCREMENT), '!', GLSLX.TokenKind.NOT), '&', GLSLX.TokenKind.BITWISE_AND), '|', GLSLX.TokenKind.BITWISE_OR), '^', GLSLX.TokenKind.BITWISE_XOR), '/', GLSLX.TokenKind.DIVIDE), '==', GLSLX.TokenKind.EQUAL), '>', GLSLX.TokenKind.GREATER_THAN), '>=', GLSLX.TokenKind.GREATER_THAN_OR_EQUAL), '<', GLSLX.TokenKind.LESS_THAN), '<=', GLSLX.TokenKind.LESS_THAN_OR_EQUAL), '&&', GLSLX.TokenKind.LOGICAL_AND), '||', GLSLX.TokenKind.LOGICAL_OR), '^^', GLSLX.TokenKind.LOGICAL_XOR), '-', GLSLX.TokenKind.MINUS), '*', GLSLX.TokenKind.MULTIPLY), '!=', GLSLX.TokenKind.NOT_EQUAL), '+', GLSLX.TokenKind.PLUS), '%', GLSLX.TokenKind.REMAINDER), '<<', GLSLX.TokenKind.SHIFT_LEFT), '>>', GLSLX.TokenKind.SHIFT_RIGHT), '=', GLSLX.TokenKind.ASSIGN), '+=', GLSLX.TokenKind.ASSIGN_ADD), '&=', GLSLX.TokenKind.ASSIGN_BITWISE_AND), '|=', GLSLX.TokenKind.ASSIGN_BITWISE_OR), '^=', GLSLX.TokenKind.ASSIGN_BITWISE_XOR), '/=', GLSLX.TokenKind.ASSIGN_DIVIDE), '*=', GLSLX.TokenKind.ASSIGN_MULTIPLY), '%=', GLSLX.TokenKind.ASSIGN_REMAINDER), '<<=', GLSLX.TokenKind.ASSIGN_SHIFT_LEFT), '>>=', GLSLX.TokenKind.ASSIGN_SHIFT_RIGHT), '-=', GLSLX.TokenKind.ASSIGN_SUBTRACT), ':', GLSLX.TokenKind.COLON), ',', GLSLX.TokenKind.COMMA), '.', GLSLX.TokenKind.DOT), '{', GLSLX.TokenKind.LEFT_BRACE), '[', GLSLX.TokenKind.LEFT_BRACKET), '(', GLSLX.TokenKind.LEFT_PARENTHESIS), '?', GLSLX.TokenKind.QUESTION), '}', GLSLX.TokenKind.RIGHT_BRACE), ']', GLSLX.TokenKind.RIGHT_BRACKET), ')', GLSLX.TokenKind.RIGHT_PARENTHESIS), ';', GLSLX.TokenKind.SEMICOLON);
  GLSLX.Tokenizer.reservedWords = in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(Object.create(null), 'asm', 0), 'cast', 0), 'class', 0), 'default', 0), 'double', 0), 'dvec2', 0), 'dvec3', 0), 'dvec4', 0), 'enum', 0), 'extern', 0), 'external', 0), 'fixed', 0), 'flat', 0), 'fvec2', 0), 'fvec3', 0), 'fvec4', 0), 'goto', 0), 'half', 0), 'hvec2', 0), 'hvec3', 0), 'hvec4', 0), 'inline', 0), 'input', 0), 'interface', 0), 'long', 0), 'namespace', 0), 'noinline', 0), 'output', 0), 'packed', 0), 'public', 0), 'sampler1D', 0), 'sampler1DShadow', 0), 'sampler2DRect', 0), 'sampler2DRectShadow', 0), 'sampler2DShadow', 0), 'sampler3D', 0), 'sampler3DRect', 0), 'short', 0), 'sizeof', 0), 'static', 0), 'superp', 0), 'switch', 0), 'template', 0), 'this', 0), 'typedef', 0), 'union', 0), 'unsigned', 0), 'using', 0), 'volatile', 0);
  GLSLX.Type.BOOL = new GLSLX.StructSymbol(-1, null, 'bool', null).resolvedType();
  GLSLX.Type.BVEC2 = new GLSLX.StructSymbol(-2, null, 'bvec2', null).resolvedType();
  GLSLX.Type.BVEC3 = new GLSLX.StructSymbol(-3, null, 'bvec3', null).resolvedType();
  GLSLX.Type.BVEC4 = new GLSLX.StructSymbol(-4, null, 'bvec4', null).resolvedType();
  GLSLX.Type.ERROR = new GLSLX.StructSymbol(-5, null, '<error>', null).resolvedType();
  GLSLX.Type.FLOAT = new GLSLX.StructSymbol(-6, null, 'float', null).resolvedType();
  GLSLX.Type.INT = new GLSLX.StructSymbol(-7, null, 'int', null).resolvedType();
  GLSLX.Type.IVEC2 = new GLSLX.StructSymbol(-8, null, 'ivec2', null).resolvedType();
  GLSLX.Type.IVEC3 = new GLSLX.StructSymbol(-9, null, 'ivec3', null).resolvedType();
  GLSLX.Type.IVEC4 = new GLSLX.StructSymbol(-10, null, 'ivec4', null).resolvedType();
  GLSLX.Type.MAT2 = new GLSLX.StructSymbol(-11, null, 'mat2', null).resolvedType();
  GLSLX.Type.MAT3 = new GLSLX.StructSymbol(-12, null, 'mat3', null).resolvedType();
  GLSLX.Type.MAT4 = new GLSLX.StructSymbol(-13, null, 'mat4', null).resolvedType();
  GLSLX.Type.SAMPLER2D = new GLSLX.StructSymbol(-14, null, 'sampler2D', null).resolvedType()._setContainsSampler();
  GLSLX.Type.SAMPLERCUBE = new GLSLX.StructSymbol(-15, null, 'samplerCube', null).resolvedType()._setContainsSampler();
  GLSLX.Type.VEC2 = new GLSLX.StructSymbol(-16, null, 'vec2', null).resolvedType();
  GLSLX.Type.VEC3 = new GLSLX.StructSymbol(-17, null, 'vec3', null).resolvedType();
  GLSLX.Type.VEC4 = new GLSLX.StructSymbol(-18, null, 'vec4', null).resolvedType();
  GLSLX.Type.VOID = new GLSLX.StructSymbol(-19, null, 'void', null).resolvedType();
  GLSLX.in_TokenKind._strings = ['ATTRIBUTE', 'BOOL', 'BREAK', 'BVEC2', 'BVEC3', 'BVEC4', 'CONST', 'CONTINUE', 'DISCARD', 'DO', 'ELSE', 'FALSE', 'FLOAT', 'FOR', 'HIGHP', 'IF', 'IN', 'INOUT', 'INT', 'INVARIANT', 'IVEC2', 'IVEC3', 'IVEC4', 'LOWP', 'MAT2', 'MAT3', 'MAT4', 'MEDIUMP', 'OUT', 'PRECISION', 'RETURN', 'SAMPLER2D', 'SAMPLERCUBE', 'STRUCT', 'TRUE', 'UNIFORM', 'VARYING', 'VEC2', 'VEC3', 'VEC4', 'VOID', 'WHILE', 'EXPORT', 'IMPORT', 'COMPLEMENT', 'DECREMENT', 'INCREMENT', 'NOT', 'BITWISE_AND', 'BITWISE_OR', 'BITWISE_XOR', 'DIVIDE', 'EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'LOGICAL_AND', 'LOGICAL_OR', 'LOGICAL_XOR', 'MINUS', 'MULTIPLY', 'NOT_EQUAL', 'PLUS', 'REMAINDER', 'SHIFT_LEFT', 'SHIFT_RIGHT', 'ASSIGN', 'ASSIGN_ADD', 'ASSIGN_BITWISE_AND', 'ASSIGN_BITWISE_OR', 'ASSIGN_BITWISE_XOR', 'ASSIGN_DIVIDE', 'ASSIGN_MULTIPLY', 'ASSIGN_REMAINDER', 'ASSIGN_SHIFT_LEFT', 'ASSIGN_SHIFT_RIGHT', 'ASSIGN_SUBTRACT', 'COLON', 'COMMA', 'DOT', 'LEFT_BRACE', 'LEFT_BRACKET', 'LEFT_PARENTHESIS', 'QUESTION', 'RIGHT_BRACE', 'RIGHT_BRACKET', 'RIGHT_PARENTHESIS', 'SEMICOLON', 'EXTENSION', 'VERSION', 'INCLUDE', 'FLOAT_LITERAL', 'IDENTIFIER', 'INT_LITERAL', 'STRING_LITERAL', 'END_OF_FILE'];

  GLSLX.Exports.main();
})();


/***/ })

});
//# sourceMappingURL=1.js.map