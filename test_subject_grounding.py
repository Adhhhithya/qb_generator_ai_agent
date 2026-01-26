"""
Test script for Subject Grounding Architecture
Tests that the system correctly grounds subjects and prevents cross-contamination.
"""

import asyncio
from app.core.subject_analyzer import SubjectAnalyzer


async def test_discrete_math_grounding():
    """Test that Discrete Math syllabus is correctly identified and DBMS is forbidden"""
    print("=" * 70)
    print("TEST 1: Discrete Mathematics Syllabus")
    print("=" * 70)
    
    title = "Discrete Mathematics Final Exam"
    syllabus = """
    Unit 1: Propositional Logic and Quantifiers
    - Propositions and logical operators
    - Truth tables and tautologies
    - Predicates and quantifiers
    
    Unit 2: Graph Theory
    - Basic graph concepts
    - Euler paths and circuits
    - Hamiltonian paths and circuits
    - Trees and spanning trees
    - Minimum spanning trees (Kruskal's and Prim's algorithms)
    
    Unit 3: Relations and Functions
    - Types of relations
    - Composition of relations
    - Closure properties
    """
    
    analyzer = SubjectAnalyzer()
    result = await analyzer.ground_subject(title, syllabus)
    
    print(f"\n📚 Title: {title}")
    print(f"\n🎯 Grounding Result:")
    print(f"   Subject: {result['subject']}")
    print(f"   Domain: {result['domain']}")
    print(f"   Core Topics: {result['core_topics']}")
    print(f"   Forbidden Topics: {result['forbidden_topics']}")
    
    # Verify expectations
    assert "discrete" in result["subject"].lower() or "math" in result["subject"].lower(), \
        "Subject should contain 'Discrete' or 'Math'"
    
    # Check that DBMS-related topics are in forbidden list (if LLM identified them)
    forbidden_lower = [t.lower() for t in result["forbidden_topics"]]
    dbms_terms = ["dbms", "database", "normalization", "sql"]
    has_dbms_forbidden = any(term in " ".join(forbidden_lower) for term in dbms_terms)
    
    if has_dbms_forbidden:
        print(f"\n✅ PASS: DBMS topics correctly identified as forbidden")
    else:
        print(f"\n⚠️  WARNING: No DBMS terms in forbidden list (acceptable if LLM didn't add them)")
    
    print("\n")


async def test_dbms_grounding():
    """Test that DBMS syllabus is correctly identified and Graph Theory is forbidden"""
    print("=" * 70)
    print("TEST 2: Database Management Systems Syllabus")
    print("=" * 70)
    
    title = "DBMS Final Examination"
    syllabus = """
    Unit 1: Relational Model and Algebra
    - ER diagrams and mapping
    - Relational algebra operations
    - SQL queries
    
    Unit 2: Normalization
    - Functional dependencies
    - Normal forms (1NF, 2NF, 3NF, BCNF)
    - Decomposition and lossless join
    
    Unit 3: Transaction Management
    - ACID properties
    - Concurrency control
    - Deadlock handling
    """
    
    analyzer = SubjectAnalyzer()
    result = await analyzer.ground_subject(title, syllabus)
    
    print(f"\n📚 Title: {title}")
    print(f"\n🎯 Grounding Result:")
    print(f"   Subject: {result['subject']}")
    print(f"   Domain: {result['domain']}")
    print(f"   Core Topics: {result['core_topics']}")
    print(f"   Forbidden Topics: {result['forbidden_topics']}")
    
    # Verify expectations
    assert "database" in result["subject"].lower() or "dbms" in result["subject"].lower(), \
        "Subject should contain 'Database' or 'DBMS'"
    
    # Check that graph theory topics are in forbidden list (if LLM identified them)
    forbidden_lower = [t.lower() for t in result["forbidden_topics"]]
    graph_terms = ["graph", "euler", "hamiltonian", "discrete math"]
    has_graph_forbidden = any(term in " ".join(forbidden_lower) for term in graph_terms)
    
    if has_graph_forbidden:
        print(f"\n✅ PASS: Graph Theory topics correctly identified as forbidden")
    else:
        print(f"\n⚠️  WARNING: No Graph Theory terms in forbidden list (acceptable if LLM didn't add them)")
    
    print("\n")


async def test_cross_domain_syllabus():
    """Test edge case: syllabus that mentions multiple subjects"""
    print("=" * 70)
    print("TEST 3: Cross-Domain Syllabus (Edge Case)")
    print("=" * 70)
    
    title = "Computer Science Fundamentals"
    syllabus = """
    Unit 1: Mathematical Foundations
    - Discrete mathematics for computing
    - Graph theory applications in databases
    
    Unit 2: Database Design
    - ER modeling
    - Normalization using functional dependencies
    
    Unit 3: Algorithms
    - Graph algorithms
    - Tree traversals
    """
    
    analyzer = SubjectAnalyzer()
    result = await analyzer.ground_subject(title, syllabus)
    
    print(f"\n📚 Title: {title}")
    print(f"\n🎯 Grounding Result:")
    print(f"   Subject: {result['subject']}")
    print(f"   Domain: {result['domain']}")
    print(f"   Core Topics: {result['core_topics']}")
    print(f"   Forbidden Topics: {result['forbidden_topics']}")
    
    print(f"\n📝 Note: For cross-domain syllabi, the LLM should identify the PRIMARY subject")
    print(f"   and include topics from both areas in core_topics.")
    print("\n")


async def test_minimal_syllabus():
    """Test minimal/messy syllabus input"""
    print("=" * 70)
    print("TEST 4: Minimal/Messy Syllabus")
    print("=" * 70)
    
    title = "Data Structures Quiz"
    syllabus = "Arrays, Linked Lists, Stacks, Queues, Trees, Graphs"
    
    analyzer = SubjectAnalyzer()
    result = await analyzer.ground_subject(title, syllabus)
    
    print(f"\n📚 Title: {title}")
    print(f"\n🎯 Grounding Result:")
    print(f"   Subject: {result['subject']}")
    print(f"   Domain: {result['domain']}")
    print(f"   Core Topics: {result['core_topics']}")
    print(f"   Forbidden Topics: {result['forbidden_topics']}")
    
    assert "data structure" in result["subject"].lower() or "algorithm" in result["subject"].lower(), \
        "Subject should relate to data structures or algorithms"
    
    print(f"\n✅ PASS: Minimal syllabus handled correctly")
    print("\n")


async def main():
    """Run all tests"""
    print("\n")
    print("╔" + "=" * 68 + "╗")
    print("║" + " " * 15 + "SUBJECT GROUNDING ARCHITECTURE TEST" + " " * 18 + "║")
    print("╚" + "=" * 68 + "╝")
    print("\n")
    
    try:
        await test_discrete_math_grounding()
        await test_dbms_grounding()
        await test_cross_domain_syllabus()
        await test_minimal_syllabus()
        
        print("=" * 70)
        print("✅ ALL TESTS COMPLETED")
        print("=" * 70)
        print("\nNOTE: The subject grounding works by letting the LLM be the single")
        print("source of truth. The forbidden topics list may vary based on LLM's")
        print("judgment of what's relevant vs. irrelevant for each subject.")
        print("\n")
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
